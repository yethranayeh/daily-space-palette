"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DateError({ error, reset }: ErrorProps) {
  const { date } = useParams<{ date: string }>();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
      <div className="font-mono text-5xl tracking-widest uppercase text-accent">500</div>
      <h1 className="text-[28px] font-semibold text-ink mb-3">Failed to load date</h1>
      <p className="text-ink-subtle mb-8 max-w-100 leading-[1.6]">
        Could not fetch the picture for {date}. This might be because NASA&apos;s servers are busy
        or this date hasn&apos;t been indexed yet.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="font-mono text-xs tracking-wide uppercase text-accent no-underline px-6 py-3 border border-line rounded-ui-sm cursor-pointer hover:bg-surface-raised transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="font-mono text-xs tracking-wide uppercase text-accent no-underline px-6 py-3 border border-line rounded-ui-sm hover:bg-surface-raised transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
