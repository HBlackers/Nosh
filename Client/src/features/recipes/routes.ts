import { createRoute } from "@tanstack/react-router";
import type { DietaryRequirement } from "@/lib/api/generated";
import { DIETARY_REQUIREMENTS } from "@/lib/enums";
import { parseList, parsePage, parseText } from "@/lib/search";
import { rootRoute } from "@/routes/__root";
import { RecipesPage } from "./pages/RecipesPage";

export const recipesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes",
  validateSearch: (search: Record<string, unknown>): { q?: string; page?: number; dietary?: DietaryRequirement[] } => ({
    q: parseText(search.q),
    page: parsePage(search.page),
    dietary: parseList(search.dietary, DIETARY_REQUIREMENTS),
  }),
  component: RecipesPage,
});
