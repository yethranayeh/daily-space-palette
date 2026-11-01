import type { Picture } from "@/app/lib/getDailyRecord";

import { ExternalLink } from "lucide-react";

import { addDays } from "@/app/utils/date";

import { Media } from "./Media";
import { Description } from "./Description";
import { NextPictureStrip } from "./NextPictureStrip";

export async function APODCard({ picture, isLatest }: { picture: Picture; isLatest: boolean }) {
  const dateLabel = new Date(picture.date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const nextDate = addDays(picture.date, 1);

  return (
    <section
      aria-label="Astronomy picture of the day"
      className="bg-surface-card border border-line rounded-ui-lg overflow-hidden shadow-ui"
    >
      <div className="relative aspect-16/10 min-h-[220px] overflow-hidden bg-[#0a0a14]">
        <Media picture={picture} />

        {picture.downloadUrl && (
          <a
            href={picture.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-ink-muted bg-[oklch(0%_0_0/0.5)] border border-line rounded-ui-sm px-2.5 py-1.5 no-underline transition-all duration-150"
          >
            <ExternalLink size={10} />
            HD
          </a>
        )}
      </div>

      <Description picture={picture} dateLabel={dateLabel} />

      {picture.nextPicture && !isLatest && (
        <NextPictureStrip nextPicture={picture.nextPicture} href={`/${nextDate}`} />
      )}
    </section>
  );
}
