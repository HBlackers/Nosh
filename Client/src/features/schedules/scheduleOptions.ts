import type { DayOfWeek, RecurrenceFrequency } from "@/lib/api/generated";
import { parseISODate } from "@/lib/dates";
import type { ISODate } from "@/lib/dates";

export const FREQUENCIES: { value: RecurrenceFrequency; label: string; unit: string }[] = [
  { value: "None", label: "Just once", unit: "" },
  { value: "Daily", label: "Every day", unit: "days" },
  { value: "Weekly", label: "Every week", unit: "weeks" },
  { value: "Monthly", label: "Every month", unit: "months" },
];

export const WEEK_DAYS: { value: DayOfWeek; label: string }[] = [
  { value: "Monday", label: "Mon" },
  { value: "Tuesday", label: "Tue" },
  { value: "Wednesday", label: "Wed" },
  { value: "Thursday", label: "Thu" },
  { value: "Friday", label: "Fri" },
  { value: "Saturday", label: "Sat" },
  { value: "Sunday", label: "Sun" },
];

const BY_JS_DAY: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const dayOfWeekOf = (date: ISODate): DayOfWeek => BY_JS_DAY[parseISODate(date).getDay()] ?? "Monday";
