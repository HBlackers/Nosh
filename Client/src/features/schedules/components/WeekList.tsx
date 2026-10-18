import { addDays, formatWeekday, formatWeekdayLong, toISODate } from "@/lib/dates";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Occurrence, groupByDate } from "../calendar";
import { OccurrenceCard } from "./OccurrenceCard";
import { ScheduleDialog } from "./ScheduleDialog";

type WeekListProps = {
  weekStart: Date;
  occurrences: Occurrence[];
  today: Date;
};

export function WeekList({ weekStart, occurrences, today }: WeekListProps) {
  const todayISO = toISODate(today);
  const byDate = groupByDate(occurrences);

  return (
    <ol className="space-y-3">
      {Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map(day => {
        const iso = toISODate(day);
        const isToday = iso === todayISO;
        const items = byDate.get(iso) ?? [];

        return (
          <li
            key={iso}
            aria-label={formatWeekdayLong(day)}
            className={cn("flex gap-4 rounded-xl border bg-card p-4", isToday && "border-primary ring-2 ring-primary/40")}
          >
            <div
              className={cn(
                "flex w-16 shrink-0 flex-col items-center justify-center rounded-lg py-2",
                isToday ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
              )}
            >
              <span className="text-base font-semibold uppercase tracking-wide">{formatWeekday(day)}</span>
              <span className="font-heading text-2xl font-bold leading-none">{day.getDate()}</span>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
                <p className="text-muted-foreground">Nothing planned</p>
                <ScheduleDialog
                  defaults={{ date: iso, frequency: "None" }}
                  trigger={
                    <Button variant="outline" size="lg" aria-label={`Plan a recipe for ${formatWeekdayLong(day)}`}>
                      <Plus aria-hidden="true" />
                      Plan a recipe
                    </Button>
                  }
                />
              </div>
            ) : (
              <ul className="flex flex-1 flex-col justify-center gap-2">
                {items.map(item => (
                  <li key={`${item.scheduleId}-${item.date}`} className="space-y-1">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-base font-semibold">{item.mealType}</span>
                    <OccurrenceCard occurrence={item} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
