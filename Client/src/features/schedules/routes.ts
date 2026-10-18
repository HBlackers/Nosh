import { createRoute } from "@tanstack/react-router";
import { parseWeek } from "@/lib/search";
import { rootRoute } from "@/routes/__root";
import { CalendarPage } from "./pages/CalendarPage";

export const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>): { week?: string } => ({
    week: parseWeek(search.week),
  }),
  component: CalendarPage,
});
