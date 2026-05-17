import type { Apod } from "@/app/lib/getPicture";
import type { PlainPalette } from "./Palette/utils/convertPaletteToPlainObjectArray";

import { Suspense } from "react";
import { AstronomyPicture } from "./AstronomyPicture/AstronomyPicture";
import { PaletteContainer } from "./Palette/PaletteContainer";
import { DatePagination } from "./Pagination/DatePagination";

type SpacePaletteLayoutProps = {
  apod: Apod | null;
  palette: PlainPalette[] | null;
  date: string;
};

export function SpacePaletteLayout({ apod, palette, date }: SpacePaletteLayoutProps) {
  return (
    <main
      className="relative z-2 px-10 pt-5 pb-15 grid gap-7 max-w-360 mx-auto"
      style={{ gridTemplateColumns: "minmax(0, 1.55fr) minmax(340px, 1fr)" }}
    >
      {apod ? (
        <AstronomyPicture data={apod} />
      ) : (
        <div className="font-mono text-ink-muted p-10">Could not get Astronomy Picture</div>
      )}
      <div className="flex flex-col gap-4">
        <Suspense fallback={null}>
          <DatePagination date={date} />
        </Suspense>
        {palette && <PaletteContainer palette={palette} />}
      </div>
    </main>
  );
}
