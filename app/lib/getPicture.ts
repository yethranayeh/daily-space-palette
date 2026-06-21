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

export const getPicture = async (date?: string) => {
  "use cache";
  if (date) {
    cacheLife("max");
  } else {
    cacheLife("hours");
  }

  const queryDate = date ?? getFormattedDate();
  console.debug("::FETCH_APOD for date:", queryDate);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${APOD_URL}?api_key=${process.env.NASA_API}&date=${queryDate}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`::FETCH_APOD - Non-OK response: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new Error(`::FETCH_APOD - Unexpected content type: ${contentType}`);
    }

    const json = (await res.json()) as Apod;
    if (json.code) {
      throw new Error(`::FETCH_APOD - API error ${json.code}: ${json.msg}`);
    }
    return json;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`::FETCH_APOD - Request timed out for date: ${queryDate}`);
    }
    throw error;
  }
};
