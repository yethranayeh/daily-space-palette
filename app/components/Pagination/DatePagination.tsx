"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";
import { addDays, parseDate } from "@/app/utils/date";
import { MIN_DATE } from "@/app/utils/validateDate";

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function DatePagination({ date, isLatest }: { date: string; isLatest: boolean }) {
  const currentDate = parseDate(date);
  if (isNaN(currentDate.getTime())) {
    return null;
  }

  const minDate = parseDate(MIN_DATE);

  const prevDate = addDays(date, -1);
  const nextDate = addDays(date, 1);

  const isAtMinDate = currentDate <= minDate;

  return (
    <Pagination>
      <PaginationContent className="flex justify-between w-full">
        {!isAtMinDate && (
          <PaginationItem>
            <PaginationPrevious href={`/${prevDate}`} />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink isActive href={`/${date}`}>
            {formatDateLabel(currentDate)}
          </PaginationLink>
        </PaginationItem>

        {!isLatest && (
          <PaginationItem>
            <PaginationNext href={`/${nextDate}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
