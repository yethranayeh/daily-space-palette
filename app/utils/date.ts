// ? The explicit time keeps parsing local; a bare date string is read as UTC,
//   which lands on the previous day for users west of Greenwich
export function parseDate(date: string) {
  return new Date(date + "T00:00:00");
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: string, days: number) {
  const parsed = parseDate(date);
  parsed.setDate(parsed.getDate() + days);
  return formatDate(parsed);
}
