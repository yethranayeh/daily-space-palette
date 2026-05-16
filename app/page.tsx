import { generatePalette } from "./lib/generatePalette";
import { AstronomyPicture } from "./components/AstronomyPicture/AstronomyPicture";
import { PaletteContainer } from "./components/Palette/PaletteContainer";

export const revalidate = 86400;

export default async function Home() {
  const palette = await generatePalette();

  return (
    <main
      className="relative z-[2] px-10 pt-5 pb-[60px] grid gap-7 max-w-[1440px] mx-auto"
      style={{ gridTemplateColumns: "minmax(0, 1.55fr) minmax(340px, 1fr)" }}
    >
      <AstronomyPicture />
      <div>{palette && <PaletteContainer />}</div>
    </main>
  );
}
