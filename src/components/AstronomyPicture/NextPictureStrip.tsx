import type { NextPicture } from "@/lib/nasaHtml";

import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

type NextPictureStripProps = {
  nextPicture: NextPicture;
  to: string;
};

export function NextPictureStrip({ nextPicture, to }: NextPictureStripProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-1.5 px-5 py-4 border-t border-line bg-surface-inset no-underline transition-colors duration-150 hover:bg-accent-soft sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
    >
      <span className="font-mono text-[10px] leading-4 tracking-[0.16em] uppercase text-ink-subtle">
        Tomorrow&apos;s picture
      </span>
      <span className="flex min-w-0 items-center gap-2 text-sm leading-5 text-ink-muted transition-colors duration-150 group-hover:text-ink">
        <span>{nextPicture.text}</span>
        <ArrowRight
          size={14}
          className="shrink-0 text-accent transition-transform duration-150 motion-safe:group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
