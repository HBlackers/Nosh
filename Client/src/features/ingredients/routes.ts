import { createRoute } from "@tanstack/react-router";
import { parsePage, parseText } from "@/lib/search";
import { rootRoute } from "@/routes/__root";
import { IngredientsPage } from "./pages/IngredientsPage";

export const ingredientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ingredients",
  validateSearch: (search: Record<string, unknown>): { q?: string; page?: number } => ({
    q: parseText(search.q),
    page: parsePage(search.page),
  }),
  component: IngredientsPage,
});
