import type { Picture } from "./getPicture";

import { cacheLife } from "next/cache";
import { Vibrant } from "node-vibrant/node";

import { convertPaletteToPlainObjectArray } from "@/app/components/Palette/utils/convertPaletteToPlainObjectArray";
import { getFormattedDate } from "@/app/utils/getFormattedDate";

export async function generatePalette(picture: Picture | null) {
  "use cache";
  if (picture != null && picture.date !== getFormattedDate()) {
    cacheLife("max");
  } else {
    cacheLife("hours");
  }

  if (picture == null) {
    throw new Error("::GENERATE_PALETTE - picture is null");
  }

  if (!picture.imageUrl) {
    throw new Error("::GENERATE_PALETTE - picture has no image");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(picture.imageUrl, { signal: controller.signal });
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
