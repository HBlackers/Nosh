import type { DayOfWeek, RecurrenceFrequency, ScheduleResponse } from "@/lib/api/generated";
import { formatDayMonth, parseISODate } from "@/lib/dates";
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

const dayMonth = (iso: ISODate) => formatDayMonth(parseISODate(iso));

export function describeSchedule(schedule: ScheduleResponse): { when: string; range: string } {
  const interval = Number(schedule.interval);
  const frequency = FREQUENCIES.find(option => option.value === schedule.frequency);
  const days = WEEK_DAYS.filter(day => schedule.daysOfWeek.includes(day.value)).map(day => day.label).join(", ");

  if (schedule.frequency === "None") {
    return { when: `${dayMonth(schedule.startDate)} · ${schedule.mealType}`, range: "Just once" };
  }

  const every = interval === 1 ? frequency?.label : `Every ${interval} ${frequency?.unit}`;
  const when = `${every}${schedule.frequency === "Weekly" && days ? ` on ${days}` : ""} · ${schedule.mealType}`;
  const end = schedule.endDate ? `, until ${dayMonth(schedule.endDate)}` : schedule.maxOccurrences ? `, ${Number(schedule.maxOccurrences)} times` : "";

  return { when, range: `From ${dayMonth(schedule.startDate)}${end}` };
}
