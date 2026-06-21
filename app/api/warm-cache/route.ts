import { generatePalette } from "@/app/lib/generatePalette";
import { getPicture } from "@/app/lib/getPicture";
import { connection, NextResponse } from "next/server";

// TODO: basic spam protection like User-Agent check for cronjob, or secret query param
export async function GET() {
  await connection();
  try {
    const apod = await getPicture();
    await generatePalette(apod);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("::WARM_CACHE -", error);
    return NextResponse.json({ ok: false, error: "Failed to warm cache" }, { status: 500 });
  }
}
