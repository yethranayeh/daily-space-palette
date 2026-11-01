import type { PlainPalette } from "@/app/components/Palette/utils/convertPaletteToPlainObjectArray";

import { cacheLife } from "next/cache";
import { Vibrant } from "node-vibrant/node";

import { APOD_API_URL, APOD_IMAGE_MAX_WIDTH } from "@/app/config";
import { splitExplanation } from "@/app/lib/nasaHtml";
import { getFormattedDate } from "@/app/utils/getFormattedDate";
import { convertPaletteToPlainObjectArray } from "@/app/components/Palette/utils/convertPaletteToPlainObjectArray";
import "server-only";

// ? Raw shape of a science.nasa.gov WordPress "apod-basic" post. It stays local
//   so the rest of the app only sees the fields it actually uses
interface ApodEntry {
  date: string;
  title: string;
  explanation: string;
  permalink: string;
  media_type: string;
  credit: string;
  copyright: string;
  alt: string;
  url: string;
  hdurl: string;
  basic_html?: string;
}

export interface Picture {
  date: string;
  title: string;
  explanation: string;
  alt: string;
  credit: string;
  mediaType: "image" | "video";
  imageUrl: string;
  downloadUrl: string;
  permalink: string;
  videoUrl: string | null;
  embedUrl: string | null;
  nextPicture: { text: string; href: string | null } | null;
}

export interface DailyRecord {
  picture: Picture | null;
  error: PictureErrorReason | null;
  palette: PlainPalette[] | null;
  paletteFailed: boolean;
  isLatest: boolean;
}

const FETCH_TIMEOUT_MS = 9000;

// ? Distinguishes a NASA outage from a bad date so the UI can say which is which
//   unreachable: timed out or network error
//   upstream:    NASA answered with a server error or rate limit (5xx / 429)
//   not-found:   NASA has no picture for that date
//   unknown:     anything else
export type PictureErrorReason = "unreachable" | "upstream" | "not-found" | "unknown";

interface PictureResult {
  picture: Picture | null;
  error: PictureErrorReason | null;
}

// ? The WordPress route takes YYMMDD, while the rest of the app speaks YYYY-MM-DD
function toApiDate(date: string) {
  return date.replace(/-/g, "").slice(2);
}

function capImageWidth(url: string) {
  if (!url) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.pathname.startsWith("/dynamicimage/")) {
      return url;
    }

    const requested = Number(parsed.searchParams.get("w"));
    if (!Number.isFinite(requested) || requested <= APOD_IMAGE_MAX_WIDTH) {
      return url;
    }

    parsed.search = `?w=${APOD_IMAGE_MAX_WIDTH}&fit=clip`;
    return parsed.toString();
  } catch {
    return url;
  }
}

// ? The real video URL only exists inside basic_html; hdurl is just the poster
function parseVideo(basicHtml: string): { videoUrl: string | null; embedUrl: string | null } {
  const source = basicHtml.match(/<source[^>]+src="([^"]+)"/i);
  if (source && /\.(mp4|webm|mov)(\?|$)/i.test(source[1])) {
    return { videoUrl: source[1], embedUrl: null };
  }

  const iframe = basicHtml.match(/<iframe[^>]+src="([^"]+)"/i);
  if (iframe) {
    const src = iframe[1].startsWith("//") ? `https:${iframe[1]}` : iframe[1];
    return { videoUrl: null, embedUrl: src };
  }

  return { videoUrl: null, embedUrl: null };
}

function toPicture(entry: ApodEntry): Picture {
  const { body, nextPicture } = splitExplanation(entry.explanation ?? "");
  const mediaType = entry.media_type === "image" ? "image" : "video";
  const media =
    mediaType === "video" ? parseVideo(entry.basic_html ?? "") : { videoUrl: null, embedUrl: null };

  return {
    date: entry.date,
    title: entry.title,
    explanation: body,
    alt: entry.alt || entry.title,
    credit: entry.credit || entry.copyright || "",
    mediaType,
    imageUrl: capImageWidth(entry.hdurl),
    downloadUrl: entry.hdurl,
    permalink: entry.permalink,
    videoUrl: media.videoUrl,
    embedUrl: media.embedUrl,
    nextPicture,
  };
}

async function fetchApod(date: string): Promise<PictureResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${APOD_API_URL}/${toApiDate(date)}`, {
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error("::FETCH_APOD - Non-OK response:", res.status, res.statusText);

      if (res.status === 429 || res.status >= 500) {
        return { picture: null, error: "upstream" };
      }

      const body = (await res.json().catch(() => null)) as { code?: string } | null;
      if (res.status === 400 || body?.code === "apod_basic_not_found") {
        return { picture: null, error: "not-found" };
      }

      return { picture: null, error: "unknown" };
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      console.error("::FETCH_APOD - Unexpected content type:", contentType);
      return { picture: null, error: "upstream" };
    }

    const entry = (await res.json()) as ApodEntry;
    return { picture: toPicture(entry), error: null };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("::FETCH_APOD - Request timed out for date:", date);
      return { picture: null, error: "unreachable" };
    }
    console.error("::FETCH_APOD -", error);
    return { picture: null, error: "unreachable" };
  } finally {
    clearTimeout(timeoutId);
  }
}

// ? Returns null instead of throwing so a failed extraction is cached with the
//   record; rethrowing would re-download the image on every request
async function extractPalette(picture: Picture): Promise<PlainPalette[] | null> {
  if (!picture.imageUrl) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(picture.imageUrl, { signal: controller.signal });
    if (!res.ok) {
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const palette = await Vibrant.from(buffer).maxDimension(400).getPalette();
    return convertPaletteToPlainObjectArray(palette);
  } catch (error) {
    console.error("::EXTRACT_PALETTE -", error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const getDailyRecord = async (date: string): Promise<DailyRecord> => {
  "use cache";
  console.debug("::GET_DAILY_RECORD for date:", date);

  // ? The clock is read here because a "use cache" body may, while a prerendered
  //   component may not. ISO strings compare chronologically
  const today = getFormattedDate();
  const isLatest = date >= today;

  const { picture, error } = await fetchApod(date);
  const palette = picture ? await extractPalette(picture) : null;
  const paletteFailed = picture != null && palette == null;

  if (!picture) {
    // ? A failed fetch should expire fast so the next request retries NASA
    cacheLife({ stale: 0, revalidate: 30, expire: 60 });
  } else if (paletteFailed) {
    // ? Short enough to recover from a bad image, long enough not to retry every request
    cacheLife({ stale: 0, revalidate: 3600, expire: 86400 });
  } else if (isLatest) {
    cacheLife("hours");
  } else {
    cacheLife("max");
  }

  return { picture, error, palette, paletteFailed, isLatest };
};
