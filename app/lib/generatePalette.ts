import { Vibrant } from "node-vibrant/node";
import { cacheLife } from "next/cache";
import { getPicture } from "./getPicture";
import { convertPaletteToPlainObjectArray } from "@/app/components/Palette/utils/convertPaletteToPlainObjectArray";

export async function generatePalette(date?: string) {
  "use cache";
  if (date) {
    cacheLife("max");
  } else {
    cacheLife("hours");
  }

  const data = await getPicture(date);

  if (data == null) {
    return null;
  } else if (data.code) {
    if (data.code === 400) {
      console.error("::GENERATE_PALETTE - 400 -", data?.msg);
    }
    return null;
  }

  const isYouTubeUrl = (url: string) => url.includes("youtube.com") || url.includes("youtu.be");

  let src = "";

  if (data.media_type !== "video") {
    src = data.url;
  }

  if (data.thumbnail_url) {
    src = data.thumbnail_url;
  }

  if (isYouTubeUrl(data.url)) {
    src = `https://i1.ytimg.com/vi/${data.url.split("/").at(-1)}/maxresdefault.jpg`;
  }

  try {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const palette = await Vibrant.from(buffer).getPalette();
    return convertPaletteToPlainObjectArray(palette);
  } catch (error) {
    console.error("::GENERATE_PALETTE -", error);
    return null;
  }
}
