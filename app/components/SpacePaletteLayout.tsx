import type { Apod } from "@/app/lib/getPicture";
import type { PlainPalette } from "./Palette/utils/convertPaletteToPlainObjectArray";

import { Suspense } from "react";
import { APODCard } from "./AstronomyPicture/APODCard";
import { PaletteShell } from "./Palette/PaletteShell";
import { Palette } from "./Palette/Palette";
import { DatePagination } from "./Pagination/DatePagination";

type SpacePaletteLayoutProps = {
  apod: Apod | null;
  palette: PlainPalette[] | null;
  date: string;
};

function isSelfHostedVideo(apod: Apod) {
  if (apod.media_type !== "video") return false;
  const isYouTube = apod.url.includes("youtube.com") || apod.url.includes("youtu.be");
  return !isYouTube && !apod.thumbnail_url;
}

function PaletteContent({ apod, palette }: { apod: Apod | null; palette: PlainPalette[] | null }) {
  if (palette) return <Palette colors={palette} />;

  if (apod && isSelfHostedVideo(apod)) {
    return (
      <div className="flex flex-col gap-2 py-3">
        <span className="font-mono text-[11px] tracking-widest uppercase text-ink-subtle">
          Palette unavailable
        </span>
        <p className="font-mono text-[11.5px] leading-relaxed text-ink-muted">
          Palette generation currently works with images and YouTube video thumbnails. Videos hosted
          by NASA are not currently supported.
        </p>
      </div>
    );
  }

  return <p className="font-mono text-[11.5px] text-ink-muted py-3">Could not generate palette.</p>;
}

export function SpacePaletteLayout({ apod, palette, date }: SpacePaletteLayoutProps) {
  return (
    <main
      className="relative z-2 px-10 pt-5 pb-15 grid gap-7 max-w-360 mx-auto"
      style={{ gridTemplateColumns: "minmax(0, 1.55fr) minmax(340px, 1fr)" }}
    >
      {apod ? (
        <APODCard data={apod} />
      ) : (
        <div className="font-mono text-ink-muted p-10">Could not get Astronomy Picture</div>
      )}
      <div className="flex flex-col gap-4">
        <Suspense fallback={null}>
          <DatePagination date={date} />
        </Suspense>
        <PaletteShell count={palette?.length}>
          <PaletteContent apod={apod} palette={palette} />
        </PaletteShell>
      </div>
    </main>
  );
}
