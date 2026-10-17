import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/routes/__root";
import { CalendarPage } from "./pages/CalendarPage";

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>): { week?: string } => ({
    week: typeof search.week === "string" && isoDate.test(search.week) ? search.week : undefined,
  }),
  component: CalendarPage,
});
