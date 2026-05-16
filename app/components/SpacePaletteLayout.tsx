import type { Apod } from "@/app/lib/getPicture";
import type { Palette as VibrantPalette } from "@vibrant/color";
import { AstronomyPicture } from "./AstronomyPicture/AstronomyPicture";
import { PaletteContainer } from "./Palette/PaletteContainer";

type SpacePaletteLayoutProps = {
  apod: Apod | null;
  palette: VibrantPalette | null;
};

export function SpacePaletteLayout({ apod, palette }: SpacePaletteLayoutProps) {
  return (
    <main
      className="relative z-[2] px-10 pt-5 pb-[60px] grid gap-7 max-w-[1440px] mx-auto"
      style={{ gridTemplateColumns: "minmax(0, 1.55fr) minmax(340px, 1fr)" }}
    >
      {apod ? (
        <AstronomyPicture data={apod} />
      ) : (
        <div className="font-mono text-ink-muted p-10">Could not get Astronomy Picture</div>
      )}
      <div>{palette && <PaletteContainer palette={palette} />}</div>
    </main>
  );
}
