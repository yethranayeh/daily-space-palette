import type { PlainPalette } from "@/app/components/Palette/utils/convertPaletteToPlainObjectArray";

import { generatePalette } from "@/app/lib/generatePalette";
import { getPicture } from "@/app/lib/getPicture";
import { getFormattedDate } from "@/app/utils/getFormattedDate";
import { SpacePaletteLayout } from "@/app/components/SpacePaletteLayout";

export async function PaletteView({ date }: { date?: string }) {
  const { apod, error } = await getPicture(date);

  let palette: PlainPalette[] | null = null;
  if (apod) {
    try {
      palette = await generatePalette(apod);
    } catch {}
  }

  // ? Fall back to the requested date so navigation survives a failed fetch.
  return (
    <SpacePaletteLayout
      apod={apod}
      apodError={error}
      palette={palette}
      date={apod?.date ?? date ?? getFormattedDate()}
    />
  );
}
