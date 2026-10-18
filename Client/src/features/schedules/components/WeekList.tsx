import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { Tabs, tabIds } from "@/components/Tabs";
import { Button } from "@/components/ui/button";
import type { MealType } from "@/lib/api/generated";
import { addDays, formatWeekday, formatWeekdayLong, toISODate } from "@/lib/dates";
import { MEAL_TYPES } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { type Occurrence, cellKey, groupByDate, groupByDateAndMeal } from "../calendar";
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
  const byCell = groupByDateAndMeal(occurrences);

  return (
    <ol className="space-y-3">
      {Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map(day => {
        const iso = toISODate(day);
        return <DayCard key={iso} day={day} iso={iso} isToday={iso === todayISO} items={byDate.get(iso) ?? []} byCell={byCell} />;
      })}
    </ol>
  );
}

type DayCardProps = {
  day: Date;
  iso: string;
  isToday: boolean;
  items: Occurrence[];
  byCell: Map<string, Occurrence[]>;
};

function DayCard({ day, iso, isToday, items, byCell }: DayCardProps) {
  const base = useId();
  const [meal, setMeal] = useState<MealType>(() => items[0]?.mealType ?? "Dinner");
  const planned = byCell.get(cellKey(iso, meal)) ?? [];
  const ids = tabIds(base, meal);

  return (
    <li aria-label={formatWeekdayLong(day)} className={cn("space-y-3 rounded-xl border bg-card p-4", isToday && "border-2 border-primary")}>
      <div
        className={cn(
          "flex w-fit items-center gap-2 rounded-lg px-3 py-2",
          isToday ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        <span className="font-semibold uppercase tracking-wide">{formatWeekday(day)}</span>
        <span className="font-heading text-2xl font-bold leading-none">{day.getDate()}</span>
      </div>

      <Tabs
        id={base}
        label={`Meals on ${formatWeekdayLong(day)}`}
        tabs={MEAL_TYPES.map(type => ({ id: type, label: type, count: byCell.get(cellKey(iso, type))?.length }))}
        value={meal}
        onChange={setMeal}
      />

      <div role="tabpanel" id={ids.panel} aria-labelledby={ids.tab}>
        {planned.length === 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground">Nothing planned for {meal.toLowerCase()}</p>
            <ScheduleDialog
              defaults={{ date: iso, mealType: meal, frequency: "None" }}
              trigger={
                <Button variant="outline" size="lg" aria-label={`Plan a recipe for ${formatWeekdayLong(day)}, ${meal}`}>
                  <Plus aria-hidden="true" />
                  Plan a recipe
                </Button>
              }
            />
          </div>
        ) : (
          <ul className="space-y-2">
            {planned.map(item => (
              <li key={`${item.scheduleId}-${item.date}`}>
                <OccurrenceCard occurrence={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
