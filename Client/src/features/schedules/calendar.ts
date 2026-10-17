import type { MealType, ScheduleOccurrenceResponse } from "@/lib/api/generated";
import type { ISODate } from "@/lib/dates";

export type Occurrence = ScheduleOccurrenceResponse;

export function groupByDate(occurrences: Occurrence[]): Map<ISODate, Occurrence[]> {
  const groups = new Map<ISODate, Occurrence[]>();
  for (const occurrence of occurrences) {
    groups.set(occurrence.date, [...(groups.get(occurrence.date) ?? []), occurrence]);
  }
  return groups;
}

export function groupByDateAndMeal(occurrences: Occurrence[]): Map<string, Occurrence[]> {
  const groups = new Map<string, Occurrence[]>();
  for (const occurrence of occurrences) {
    const key = cellKey(occurrence.date, occurrence.mealType);
    groups.set(key, [...(groups.get(key) ?? []), occurrence]);
  }
  return groups;
}

export const cellKey = (date: ISODate, meal: MealType) => `${date}|${meal}`;
