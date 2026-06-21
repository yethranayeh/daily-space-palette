import { generatePalette } from "./lib/generatePalette";
import { getPicture } from "./lib/getPicture";
import { getFormattedDate } from "@/app/utils/getFormattedDate";
import { SpacePaletteLayout } from "./components/SpacePaletteLayout";

export default async function Home() {
  const apod = await getPicture();
  const palette = apod ? await generatePalette(apod) : null;

  return <SpacePaletteLayout apod={apod} palette={palette} date={apod?.date ?? getFormattedDate()} />;
}
