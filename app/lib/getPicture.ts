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
    const res = await fetch(`${APOD_URL}?api_key=${process.env.NASA_API}&date=${queryDate}`);
    const json = (await res.json()) as Apod;

    return json;
  } catch (error) {
    console.error("::FETCH_APOD -", error);
    return null;
  }
};
