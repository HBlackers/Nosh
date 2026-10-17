import { Link, getRouteApi } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDays, formatDayMonth, formatRange, parseISODate, startOfWeek, toISODate } from "@/lib/dates";
import { WeekCalendar } from "../components/WeekCalendar";
import { useScheduleOccurrences } from "../hooks/useScheduleOccurrences";

const route = getRouteApi("/");

export function CalendarPage() {
  const { week } = route.useSearch();

  const today = new Date();
  const currentWeekStart = startOfWeek(today);
  const weekStart = week ? startOfWeek(parseISODate(week)) : currentWeekStart;
  const weekEnd = addDays(weekStart, 6);
  const isCurrentWeek = toISODate(weekStart) === toISODate(currentWeekStart);

  const { data, isPending, isError, refetch } = useScheduleOccurrences(toISODate(weekStart), toISODate(weekEnd));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">{isCurrentWeek ? "This week" : "Week of " + formatDayMonth(weekStart)}</h1>
          <p className="text-muted-foreground">{formatRange(weekStart, weekEnd)}</p>
        </div>

        <nav aria-label="Change week" className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon" aria-label="Previous week">
            <Link to="/" search={{ week: toISODate(addDays(weekStart, -7)) }}>
              <ChevronLeft />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/" search={{}}>
              Today
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" aria-label="Next week">
            <Link to="/" search={{ week: toISODate(addDays(weekStart, 7)) }}>
              <ChevronRight />
            </Link>
          </Button>
        </nav>
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
