import { connection, NextResponse } from "next/server";

import { getFormattedDate } from "@/app/utils/getFormattedDate";

export async function GET(request: Request) {
  await connection();

  // ? A cached redirect would still point at yesterday after midnight
  const response = NextResponse.redirect(new URL(`/${getFormattedDate()}`, request.url), 308);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
