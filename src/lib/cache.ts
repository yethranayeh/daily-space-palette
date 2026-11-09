import type { DailyRecord } from "./types";

const PREFIX = "sos:v1:";
const MAX_ENTRIES = 100;
const TODAY_TTL_MS = 5 * 60 * 1000;
const FAILURE_TTL_MS = 60 * 1000;

interface CachedRecord {
  record: DailyRecord;
  cachedAt: number;
}

function storageKey(date: string) {
  return `${PREFIX}${date}`;
}

function canUseStorage() {
  try {
    return typeof window !== "undefined" && window.localStorage != null;
  } catch {
    return false;
  }
}

export function readCachedRecord(date: string, isLatest: boolean): DailyRecord | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey(date));
    if (!raw) {
      return null;
    }

    const cached = JSON.parse(raw) as CachedRecord;
    if (!cached.record || typeof cached.cachedAt !== "number") {
      return null;
    }

    // ? Past pictures never change, so only the current day and failures expire
    const ttl = cached.record.picture == null ? FAILURE_TTL_MS : isLatest ? TODAY_TTL_MS : Infinity;
    if (Date.now() - cached.cachedAt > ttl) {
      window.localStorage.removeItem(storageKey(date));
      return null;
    }

    return cached.record;
  } catch {
    return null;
  }
}

export function writeCachedRecord(date: string, record: DailyRecord): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(storageKey(date), JSON.stringify({ record, cachedAt: Date.now() }));
    pruneCache();
  } catch {
    // ? A full or blocked storage should not stop the page from rendering
  }
}

export function pruneCache(): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    const entries: Array<{ key: string; cachedAt: number }> = [];

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key?.startsWith(PREFIX)) {
        continue;
      }

      const raw = window.localStorage.getItem(key);
      if (!raw) {
        continue;
      }

      const cached = JSON.parse(raw) as CachedRecord;
      entries.push({ key, cachedAt: cached.cachedAt ?? 0 });
    }

    if (entries.length <= MAX_ENTRIES) {
      return;
    }

    entries.sort((a, b) => a.cachedAt - b.cachedAt);
    for (const entry of entries.slice(0, entries.length - MAX_ENTRIES)) {
      window.localStorage.removeItem(entry.key);
    }
  } catch {
    // ? Pruning is best effort
  }
}
