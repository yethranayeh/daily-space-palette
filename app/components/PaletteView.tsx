import type { Apod } from "@/app/lib/getPicture";
import type { PlainPalette } from "@/app/components/Palette/utils/convertPaletteToPlainObjectArray";

import { connection } from "next/server";

import { generatePalette } from "@/app/lib/generatePalette";
import { getPicture } from "@/app/lib/getPicture";
import { getFormattedDate } from "@/app/utils/getFormattedDate";
import { SpacePaletteLayout } from "@/app/components/SpacePaletteLayout";

export async function PaletteView({ date }: { date?: string }) {
  await connection(); // ? keeps the NASA fetch at request time so a slow or failing API never blocks the build

  const queryDate = date ?? getFormattedDate();

  let apod: Apod | null = null;
  try {
    // ? getPicture/generatePalette still cache the result.
    apod = await getPicture(date);
  } catch {}

  let palette: PlainPalette[] | null = null;
  if (apod) {
    try {
      palette = await generatePalette(apod);
    } catch {}
  }

  return <SpacePaletteLayout apod={apod} palette={palette} date={apod?.date ?? queryDate} />;
}
