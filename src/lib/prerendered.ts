import type { DailyRecord } from "./types";

// ? The prerender script embeds the record for recent dates, so the first paint
//   does not wait on NASA or on palette extraction
export function readPrerenderedRecord(): DailyRecord | null {
  return typeof window !== "undefined" ? (window.__RECORD__ ?? null) : null;
}
