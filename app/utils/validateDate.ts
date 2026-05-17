export const MIN_DATE = "1995-06-16";

export function isValidDate(date: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    return false;
  }

  const parsed = new Date(date + "T00:00:00");
  if (isNaN(parsed.getTime())) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() + 1 !== month ||
    parsed.getDate() !== day
  ) {
    return false;
  }

  if (parsed < new Date(MIN_DATE + "T00:00:00")) {
    return false;
  }

  return true;
}

export function isFutureDate(date: string): boolean {
  const today = new Date();
  const todayPST = new Date(today.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  todayPST.setHours(0, 0, 0, 0);
  const parsed = new Date(date + "T00:00:00");

  return parsed > todayPST;
}
