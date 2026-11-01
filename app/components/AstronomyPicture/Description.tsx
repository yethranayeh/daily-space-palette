import type { Picture } from "@/app/lib/getPicture";

import { NasaRichText } from "./NasaRichText";
import { ShareButton } from "./ShareButton";

const RICH_TEXT =
  "text-sm leading-6 text-ink-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-accent/40";

type DescriptionProps = {
  picture: Picture;
  dateLabel?: string;
};

export const Description = ({ picture, dateLabel }: DescriptionProps) => {
  const { title, date, explanation, credit, mediaType } = picture;

  return (
    <div className="p-5 sm:p-6 border-t border-line space-y-4">
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
              {mediaType === "video" ? "Video" : "Image"}
            </span>
            <ShareButton date={date} />
          </div>
        </div>

        <div className="font-mono text-xs tracking-widest uppercase text-ink-subtle">
          {dateLabel || date}
        </div>
      </div>

      <div className={RICH_TEXT}>
        <NasaRichText html={explanation} />
      </div>

      {credit && (
        <div className="font-mono text-xs uppercase text-ink-subtle">
          © Copyright ·{" "}
          <span className="text-ink-muted font-medium [&_a]:underline [&_a]:underline-offset-2">
            <NasaRichText html={credit} />
          </span>
        </div>
      )}
    </div>
  );
};
