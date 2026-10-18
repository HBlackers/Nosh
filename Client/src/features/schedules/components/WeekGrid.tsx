import { addDays, formatWeekday, formatWeekdayLong, toISODate } from "@/lib/dates";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MEAL_TYPES } from "@/lib/enums";
import { type Occurrence, cellKey, groupByDateAndMeal } from "../calendar";
import { OccurrenceCard } from "./OccurrenceCard";
import { ScheduleDialog } from "./ScheduleDialog";

type WeekGridProps = {
  weekStart: Date;
  occurrences: Occurrence[];
  today: Date;
};

export function WeekGrid({ weekStart, occurrences, today }: WeekGridProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const todayISO = toISODate(today);
  const cells = groupByDateAndMeal(occurrences);

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">Recipes planned for the week</caption>
        <thead>
          <tr>
            <td className="w-36" />
            {days.map(day => {
              const isToday = toISODate(day) === todayISO;
              return (
                <th
                  key={toISODate(day)}
                  scope="col"
                  aria-current={isToday ? "date" : undefined}
                  aria-label={formatWeekdayLong(day)}
                  className={cn("border-l px-1 py-3 text-center font-normal", isToday && "bg-primary/15")}
                >
                  <span className="block text-base font-semibold uppercase tracking-wide text-muted-foreground">{formatWeekday(day)}</span>
                  <span
                    className={cn(
                      "mx-auto mt-1 flex size-9 items-center justify-center rounded-full font-heading text-lg font-bold",
                      isToday && "bg-primary text-primary-foreground",
                    )}
                  >
                    {day.getDate()}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {MEAL_TYPES.map(meal => (
            <tr key={meal} className="border-t">
              <th scope="row" className="px-2 py-3 text-left align-top text-base font-semibold text-muted-foreground">
                {meal}
              </th>
              {days.map(day => {
                const iso = toISODate(day);
                const items = cells.get(cellKey(iso, meal)) ?? [];
                return (
                  <td key={iso} className={cn("h-24 border-l p-1 align-top", iso === todayISO && "bg-primary/15")}>
                    {items.length === 0 && (
                      <ScheduleDialog
                        defaults={{ date: iso, mealType: meal, frequency: "None" }}
                        trigger={
                          <button
                            type="button"
                            aria-label={`Plan a recipe for ${formatWeekdayLong(day)}, ${meal}`}
                            className="flex h-full min-h-20 w-full items-center justify-center rounded-md border border-dashed border-input text-muted-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
                          >
                            <Plus className="size-5" aria-hidden="true" />
                          </button>
                        }
                      />
                    )}
                    {items.length > 0 && (
                      <ul className="space-y-1">
                        {items.map(item => (
                          <li key={`${item.scheduleId}-${item.date}`}>
                            <OccurrenceCard occurrence={item} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
