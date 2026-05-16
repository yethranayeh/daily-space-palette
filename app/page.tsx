import { generatePalette } from "./lib/generatePalette";
import { getPicture } from "./lib/getPicture";
import { SpacePaletteLayout } from "./components/SpacePaletteLayout";

export const revalidate = 86400;

export default async function Home() {
  const [apod, palette] = await Promise.all([getPicture(), generatePalette()]);

  return <SpacePaletteLayout apod={apod} palette={palette} />;
}
