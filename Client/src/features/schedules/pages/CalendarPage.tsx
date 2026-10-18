import { getRouteApi } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { WeekNav } from "@/components/WeekNav";
import { Button } from "@/components/ui/button";
import { formatDayMonth, formatRange, resolveWeek, toISODate } from "@/lib/dates";
import { ScheduleDialog } from "../components/ScheduleDialog";
import { WeekCalendar } from "../components/WeekCalendar";
import { WeekProgress } from "../components/WeekProgress";
import { useScheduleOccurrences } from "../hooks/useScheduleOccurrences";

const route = getRouteApi("/");

export function CalendarPage() {
  const { week } = route.useSearch();

  const { today, weekStart, weekEnd, isCurrentWeek } = resolveWeek(week);

  const { data, isPending, isError, refetch } = useScheduleOccurrences(toISODate(weekStart), toISODate(weekEnd));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">{isCurrentWeek ? "This week" : "Week of " + formatDayMonth(weekStart)}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-muted-foreground">{formatRange(weekStart, weekEnd)}</p>
            {data && <WeekProgress occurrences={data.items} />}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ScheduleDialog
            defaults={{ date: toISODate(today) }}
            trigger={
              <Button size="lg">
                <Plus aria-hidden="true" />
                Plan a recipe
              </Button>
            }
          />
          <WeekNav to="/" weekStart={weekStart} />
        </div>
      </div>

      {isPending && <p className="text-muted-foreground">Loading your week…</p>}

      {isError && (
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <p>We couldn't load your week. Please try again.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {data && <WeekCalendar weekStart={weekStart} occurrences={data.items} today={today} />}
    </div>
  );
}
