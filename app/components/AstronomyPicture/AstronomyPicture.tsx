import type { Apod } from "../../lib/getPicture";
import { ExternalLink } from "lucide-react";
import { Picture } from "./Picture";
import { Description } from "./Description";

export async function AstronomyPicture({ data }: { data: Apod }) {
  if (data == null || "code" in data) {
    return (
      <div className="font-mono text-ink-muted p-10">
        Could not get Astronomy Picture of the Day
      </div>
    );
  }

  const dateLabel = data.date
    ? new Date(data.date + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <section
      aria-label="Astronomy picture of the day"
      className="bg-surface-card border border-line rounded-ui-lg overflow-hidden shadow-ui"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a14]">
        <Picture {...data} />

        {data.hdurl && (
          <a
            href={data.hdurl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-ink-muted bg-[oklch(0%_0_0_/_0.5)] border border-line rounded-ui-sm px-[10px] py-[6px] no-underline transition-all duration-150"
          >
            <ExternalLink size={10} />
            HD
          </a>
        )}
      </div>

      <Description {...data} dateLabel={dateLabel} />
    </section>
  );
}
