/// <reference types="vite/client" />

import type { DailyRecord } from "@/lib/types";

declare global {
  interface ImportMetaEnv {
    readonly VITE_CF_BEACON_TOKEN?: string;
  }

  interface Window {
    __RECORD__?: DailyRecord;
    __themeInit: string;
  }
}

export {};
