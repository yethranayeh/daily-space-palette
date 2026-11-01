import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { isValidDate } from "@/app/utils/validateDate";

export function proxy(request: NextRequest) {
  const date = request.nextUrl.pathname.slice(1);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.next();
  }

  if (isValidDate(date)) {
    return NextResponse.next();
  }

  // ? The loading boundary starts streaming before notFound() runs, which locks
  //   the status at 200. Refusing the date here is the only way to send a real
  //   404. The target needs two segments, otherwise [date] renders it as a day
  return NextResponse.rewrite(new URL("/not-found/invalid-date", request.url));
}

export const config = {
  matcher: "/:date",
};
