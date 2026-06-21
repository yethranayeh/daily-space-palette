import { generatePalette } from "@/app/lib/generatePalette";
import { getPicture } from "@/app/lib/getPicture";
import { NextResponse } from "next/server";

// TODO: basic spam protection like User-Agent check for cronjob, or secret query param
export async function GET() {
  const apod = await getPicture();
  await generatePalette(apod);
  return NextResponse.json({ ok: true });
}
