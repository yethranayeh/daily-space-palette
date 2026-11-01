"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";
import { MIN_DATE } from "@/app/utils/validateDate";

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function DatePagination({ date, today }: { date: string; today: string }) {
  const currentDate = parseDate(date);
  if (isNaN(currentDate.getTime())) {
    return null;
  }

  const minDate = parseDate(MIN_DATE);
  const todayDate = parseDate(today);

  const prevDate = formatDate(addDays(currentDate, -1));
  const nextDate = formatDate(addDays(currentDate, 1));

  const isAtMinDate = currentDate <= minDate;
  const isAtToday = currentDate >= todayDate;

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

        {!isAtToday && (
          <PaginationItem>
            <PaginationNext href={`/${nextDate}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
