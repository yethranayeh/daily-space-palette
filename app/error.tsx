"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
      <div className="font-mono text-5xl tracking-widest uppercase text-accent">500</div>
      <h1 className="text-[28px] font-semibold text-ink mb-3">Something went wrong</h1>
      <p className="text-ink-subtle mb-8 max-w-100 leading-[1.6]">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="font-mono text-xs tracking-wide uppercase text-accent no-underline px-6 py-3 border border-line rounded-ui-sm cursor-pointer hover:bg-surface-raised transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
