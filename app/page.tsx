import { generatePalette } from "./lib/generatePalette";
import { getPicture } from "./lib/getPicture";
import { SpacePaletteLayout } from "./components/SpacePaletteLayout";
import type { PlainPalette } from "./components/Palette/utils/convertPaletteToPlainObjectArray";

export default async function Home() {
  const apod = await getPicture();

  let palette: PlainPalette[] | null = null;
  try {
    palette = await generatePalette(apod);
  } catch {
    // palette generation failed — show APOD without colors
  }

  return <SpacePaletteLayout apod={apod} palette={palette} date={apod.date} />;
}
