import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { addDays, parseDate } from "@/lib/date";
import { MIN_DATE } from "@/lib/validateDate";

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
            <PaginationPrevious to={`/${prevDate}`} />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink isActive to={`/${date}`}>
            {formatDateLabel(currentDate)}
          </PaginationLink>
        </PaginationItem>

        {!isLatest && (
          <PaginationItem>
            <PaginationNext to={`/${nextDate}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
