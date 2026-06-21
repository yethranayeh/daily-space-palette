import { APOD_URL } from "@/app/config";
import { getFormattedDate } from "@/app/utils/getFormattedDate";
import { cacheLife } from "next/cache";
import "server-only";

export interface Apod {
  title: string;
  explanation: string;
  copyright: string;
  date: string;

  url: string;
  hdurl: string;
  media_type: "image" | "video";
  thumbnail_url?: string;

  resource?: Record<"image_set" | "planet", string>;
  concepts?: Record<number, string>;
  service_version: string;

  code?: number;
  msg?: string;
}

const FETCH_TIMEOUT_MS = 9000;

async function fetchApod(queryDate: string): Promise<Apod | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${APOD_URL}?api_key=${process.env.NASA_API}&date=${queryDate}`, {
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error("::FETCH_APOD - Non-OK response:", res.status, res.statusText);
      return null;
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      console.error("::FETCH_APOD - Unexpected content type:", contentType);
      return null;
    }

    const json = (await res.json()) as Apod;
    if (json.code) {
      console.error(`::FETCH_APOD - API error ${json.code}: ${json.msg}`);
      return null;
    }
    return json;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("::FETCH_APOD - Request timed out for date:", queryDate);
    } else {
      console.error("::FETCH_APOD -", error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const getPicture = async (date?: string): Promise<Apod | null> => {
  "use cache";
  const queryDate = date ?? getFormattedDate();
  console.debug("::FETCH_APOD for date:", queryDate);

  const apod = await fetchApod(queryDate);

  if (!apod) {
    // ? A failed fetch should expire fast so the next request retries NASA
    cacheLife({ stale: 0, revalidate: 30, expire: 60 });
  } else if (date) {
    cacheLife("max");
  } else {
    cacheLife("hours");
  }

  return apod;
};
