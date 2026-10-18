import { createRoute } from "@tanstack/react-router";
import { parseWeek } from "@/lib/search";
import { rootRoute } from "@/routes/__root";
import { ShoppingListPage } from "./pages/ShoppingListPage";

export const shoppingListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shopping-list",
  validateSearch: (search: Record<string, unknown>): { week?: string } => ({
    week: parseWeek(search.week),
  }),
  component: ShoppingListPage,
});
