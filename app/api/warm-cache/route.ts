import { connection, NextResponse } from "next/server";

import { getDailyRecord } from "@/app/lib/getDailyRecord";
import { getFormattedDate } from "@/app/utils/getFormattedDate";

export const maxDuration = 60;

// TODO: basic spam protection like User-Agent check for cronjob, or secret query param
export async function GET() {
  await connection();
  try {
    const { picture } = await getDailyRecord(getFormattedDate());
    if (!picture) {
      return NextResponse.json({ ok: false, error: "No picture for today" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("::WARM_CACHE -", error);
    return NextResponse.json({ ok: false, error: "Failed to warm cache" }, { status: 500 });
  }
}
