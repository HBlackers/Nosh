import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDays, toISODate } from "@/lib/dates";

type WeekNavProps = {
  to: "/" | "/shopping-list";
  weekStart: Date;
};

export function WeekNav({ to, weekStart }: WeekNavProps) {
  return (
    <nav aria-label="Change week" className="flex items-center gap-2">
      <Button asChild variant="outline" size="icon" aria-label="Previous week">
        <Link to={to} search={{ week: toISODate(addDays(weekStart, -7)) }}>
          <ChevronLeft />
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link to={to} search={{}}>
          Today
        </Link>
      </Button>
      <Button asChild variant="outline" size="icon" aria-label="Next week">
        <Link to={to} search={{ week: toISODate(addDays(weekStart, 7)) }}>
          <ChevronRight />
        </Link>
      </Button>
    </nav>
  );
}
