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
    return null;
  }

  if (apod.code) {
    if (apod.code === 400) {
      console.error("::GENERATE_PALETTE - 400 -", apod.msg);
    }
    return null;
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

  try {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const palette = await Vibrant.from(buffer).maxDimension(400).getPalette();
    return convertPaletteToPlainObjectArray(palette);
  } catch (error) {
    console.error("::GENERATE_PALETTE -", error);
    return null;
  }
}
