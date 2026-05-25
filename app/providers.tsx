"use client";

import { ProgressProvider } from "@bprogress/next/app";

const DARK_ACCENT = "#e8c24a";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height="3px"
      color={DARK_ACCENT}
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
