import type { Apod } from "@/app/lib/getPicture";

import { ShareButton } from "./ShareButton";

type DescriptionProps = Apod & { dateLabel?: string };

export const Description = ({
  title,
  date,
  explanation,
  copyright,
  media_type,
  dateLabel,
}: DescriptionProps) => (
  <div className="p-5 sm:p-6 border-t border-line space-y-4">
    {/* Title row */}
    <div className="space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 sm:gap-x-6 mb-2">
        <h2
          className="font-display font-medium leading-[1.05] tracking-tight m-0 text-ink min-w-0"
          style={{ fontSize: "clamp(22px, 2.5vw, 30px)" }}
        >
          {title}
        </h2>
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-muted px-[9px] py-1 border border-line-strong rounded-full whitespace-nowrap shrink-0">
            {media_type === "video" ? "Video" : "Image"}
          </span>
          <ShareButton date={date} />
        </div>
      </div>

      {/* Date */}
      <div className="font-mono text-xs tracking-widest uppercase text-ink-subtle">
        {dateLabel || date}
      </div>
    </div>

    {/* Explanation */}
    <p className="text-sm leading-6 text-ink-muted">{explanation}</p>

    {/* Copyright */}
    {copyright && (
      <div className="font-mono text-xs uppercase text-ink-subtle">
        © Copyright · <span className="text-ink-muted font-medium">{copyright}</span>
      </div>
    )}
  </div>
);
