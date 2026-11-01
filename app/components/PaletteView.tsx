import type { PlainPalette } from "@/app/components/Palette/utils/convertPaletteToPlainObjectArray";

import { generatePalette } from "@/app/lib/generatePalette";
import { getPicture } from "@/app/lib/getPicture";
import { getFormattedDate } from "@/app/utils/getFormattedDate";
import { SpacePaletteLayout } from "@/app/components/SpacePaletteLayout";

export async function PaletteView({ date }: { date?: string }) {
  const { picture, error } = await getPicture(date);

  let palette: PlainPalette[] | null = null;
  if (picture) {
    try {
      palette = await generatePalette(picture);
    } catch {}
  }

  // ? Fall back to the requested date so navigation survives a failed fetch.
  return (
    <SpacePaletteLayout
      picture={picture}
      pictureError={error}
      palette={palette}
      date={picture?.date ?? date ?? getFormattedDate()}
    />
  );
}
