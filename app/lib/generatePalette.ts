import { Vibrant } from "node-vibrant/node";
import { cacheLife } from "next/cache";
import type { Apod } from "./getPicture";
import { getFormattedDate } from "@/app/utils/getFormattedDate";
import { convertPaletteToPlainObjectArray } from "@/app/components/Palette/utils/convertPaletteToPlainObjectArray";

export async function generatePalette(apod: Apod | null) {
  "use cache";
  if (apod != null && apod.date !== getFormattedDate()) {
    cacheLife("max");
  } else {
    cacheLife("hours");
  }

  if (apod == null) {
    throw new Error("::GENERATE_PALETTE - apod is null");
  }

  if (apod.code) {
    throw new Error(`::GENERATE_PALETTE - API error ${apod.code}: ${apod.msg}`);
  }

  const isYouTubeUrl = (url: string) => url.includes("youtube.com") || url.includes("youtu.be");

  let src = "";

  if (apod.media_type !== "video") {
    src = apod.url;
  }

  if (apod.thumbnail_url) {
    src = apod.thumbnail_url;
  }

  if (isYouTubeUrl(apod.url)) {
    src = `https://i1.ytimg.com/vi/${apod.url.split("/").at(-1)}/maxresdefault.jpg`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(src, { signal: controller.signal });
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const palette = await Vibrant.from(buffer).maxDimension(400).getPalette();
    return convertPaletteToPlainObjectArray(palette);
  } catch (error) {
    console.error("::GENERATE_PALETTE -", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
