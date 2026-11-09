import { useEffect, useState } from "react";
import { useParams } from "react-router";

import type { DailyRecord } from "@/lib/types";

import { applyRecordMeta } from "@/lib/meta";
import { getFormattedDate } from "@/lib/getFormattedDate";
import { isValidDate } from "@/lib/validateDate";
import { loadRecord } from "@/lib/record";
import { readPrerenderedRecord } from "@/lib/prerendered";
import { Loading } from "@/components/Loading";
import { SpacePaletteLayout } from "@/components/SpacePaletteLayout";

import { NotFound } from "./NotFound";

function fallbackRecord(date: string): DailyRecord {
  return {
    picture: null,
    error: "unknown",
    palette: null,
    paletteFailed: false,
    isLatest: date >= getFormattedDate(),
  };
}

export function DateRoute() {
  const { date = "" } = useParams();
  const valid = isValidDate(date);
  const prerendered = readPrerenderedRecord();
  const matchesPrerendered = prerendered?.picture?.date === date;

  const [record, setRecord] = useState<DailyRecord | null>(() =>
    matchesPrerendered ? prerendered : null,
  );
  const [loading, setLoading] = useState(valid && !matchesPrerendered);

  useEffect(() => {
    if (!valid) {
      return;
    }

    let cancelled = false;

    loadRecord(date, matchesPrerendered ? prerendered : null)
      .then((next) => {
        if (!cancelled) {
          setRecord(next);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("::LOAD_RECORD -", error);
        if (!cancelled) {
          setRecord(fallbackRecord(date));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [date, valid, matchesPrerendered, prerendered]);

  useEffect(() => {
    if (valid) {
      applyRecordMeta(date, record);
    }
  }, [date, record, valid]);

  if (!valid) {
    return <NotFound />;
  }

  if (loading || !record) {
    return <Loading />;
  }

  return (
    <SpacePaletteLayout
      picture={record.picture}
      pictureError={record.error}
      palette={record.palette}
      date={record.picture?.date ?? date}
      isLatest={record.isLatest}
    />
  );
}
