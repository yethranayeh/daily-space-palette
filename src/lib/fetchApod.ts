import type { Picture, PictureErrorReason } from "./types";

import { APOD_API_URL, APOD_IMAGE_MAX_WIDTH } from "./config";
import { capImageWidth, toApiDate } from "./apod";
import { splitExplanation } from "./nasaHtml";

// ? Raw shape of a science.nasa.gov WordPress "apod-basic" post. It stays local
//   so the rest of the app only sees the fields it actually uses
export interface ApodEntry {
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

interface PictureResult {
  picture: Picture | null;
  error: PictureErrorReason | null;
}

const FETCH_TIMEOUT_MS = 9000;

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

export function toPicture(entry: ApodEntry): Picture {
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
    imageUrl: capImageWidth(entry.hdurl, APOD_IMAGE_MAX_WIDTH),
    downloadUrl: entry.hdurl,
    permalink: entry.permalink,
    videoUrl: media.videoUrl,
    embedUrl: media.embedUrl,
    nextPicture,
  };
}

export async function fetchApod(date: string): Promise<PictureResult> {
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
