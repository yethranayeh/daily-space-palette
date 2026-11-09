import type { DailyRecord } from "./types";

let latestPromise: Promise<Map<string, DailyRecord>> | null = null;

function loadLatest() {
  latestPromise ??= fetch("/data/latest.json")
    .then((res) => (res.ok ? (res.json() as Promise<DailyRecord[]>) : []))
    .then((records) => {
      const map = new Map<string, DailyRecord>();
      for (const record of records) {
        if (record.picture?.date) {
          map.set(record.picture.date, record);
        }
      }
      return map;
    })
    .catch(() => new Map<string, DailyRecord>());

  return latestPromise;
}

// ? The daily build already knows the recent window, so client-side navigation
//   inside it should not call NASA or re-extract a palette
export async function readLatestRecord(date: string): Promise<DailyRecord | null> {
  const map = await loadLatest();
  return map.get(date) ?? null;
}
