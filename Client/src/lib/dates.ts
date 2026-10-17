export type ISODate = string;

const pad = (n: number) => String(n).padStart(2, "0");

// Local calendar day, not UTC: toISOString() would shift the date for anyone not on UTC.
export function toISODate(date: Date): ISODate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseISODate(iso: ISODate): Date {
  const [year = 1970, month = 1, day = 1] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + days);
  return result;
}

// Weeks start on Monday, matching the API.
export function startOfWeek(date: Date): Date {
  return addDays(date, -((date.getDay() + 6) % 7));
}

const rangeFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

export const formatDayMonth = (date: Date) => rangeFormat.format(date);

export function formatRange(start: Date, end: Date): string {
  return `${rangeFormat.format(start)} – ${rangeFormat.format(end)}`;
}

export const formatWeekday = (date: Date) => new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date);

export const formatWeekdayLong = (date: Date) => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(date);
