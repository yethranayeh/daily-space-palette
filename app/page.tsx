import { generatePalette } from "./lib/generatePalette";
import { getPicture } from "./lib/getPicture";
import { SpacePaletteLayout } from "./components/SpacePaletteLayout";

export default async function Home() {
  const [apod, palette] = await Promise.all([getPicture(), generatePalette()]);

  return <SpacePaletteLayout apod={apod} palette={palette} date={apod?.date ?? ""} />;
}
