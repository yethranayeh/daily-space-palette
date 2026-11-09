import type { PlainPalette } from "@/components/Palette/utils/convertPaletteToPlainObjectArray";

import { convertPaletteToPlainObjectArray } from "@/components/Palette/utils/convertPaletteToPlainObjectArray";

// ? A failed extraction resolves to null instead of throwing so the page can
//   still show the picture and the caller can decide how long to cache it
export async function extractPalette(imageUrl: string): Promise<PlainPalette[] | null> {
  if (!imageUrl) {
    return null;
  }

  try {
    // ? The browser build is a separate chunk, so archive dates pay for it and
    //   prerendered dates never download it
    const { Vibrant } = await import("node-vibrant/browser");
    const palette = await Vibrant.from(imageUrl).maxDimension(400).getPalette();
    return convertPaletteToPlainObjectArray(palette);
  } catch (error) {
    console.error("::EXTRACT_PALETTE -", error);
    return null;
  }
}
