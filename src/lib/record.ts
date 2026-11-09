import type { DailyRecord } from "./types";

import { extractPalette } from "./extractPalette";
import { fetchApod } from "./fetchApod";
import { getFormattedDate } from "./getFormattedDate";
import { readCachedRecord, writeCachedRecord } from "./cache";
import { readLatestRecord } from "./latest";

export async function loadRecord(
  date: string,
  prerendered?: DailyRecord | null,
): Promise<DailyRecord> {
  const isLatest = date >= getFormattedDate();

  if (prerendered && prerendered.picture?.date === date) {
    return prerendered;
  }

  const cached = readCachedRecord(date, isLatest);
  if (cached) {
    return cached;
  }

  const latest = await readLatestRecord(date);
  if (latest) {
    writeCachedRecord(date, latest);
    return latest;
  }

  const { picture, error } = await fetchApod(date);
  const palette = picture ? await extractPalette(picture.imageUrl) : null;
  const record: DailyRecord = {
    picture,
    error,
    palette,
    paletteFailed: picture != null && palette == null,
    isLatest,
  };

  writeCachedRecord(date, record);
  return record;
}
