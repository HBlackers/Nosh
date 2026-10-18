import { createRoute } from "@tanstack/react-router";
import type { DietaryRequirement } from "@/lib/api/generated";
import { DIETARY_REQUIREMENTS } from "@/lib/enums";
import { parseList, parsePage, parseText } from "@/lib/search";
import { rootRoute } from "@/routes/__root";
import { RecipesPage } from "./pages/RecipesPage";

export const recipesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes",
  validateSearch: (search: Record<string, unknown>): { q?: string; page?: number; dietary?: DietaryRequirement[]; view?: "starter" } => ({
    q: parseText(search.q),
    page: parsePage(search.page),
    // Absent means "not chosen yet" (use the saved preference); an empty list means the user chose All.
    dietary: Array.isArray(search.dietary) ? (parseList(search.dietary, DIETARY_REQUIREMENTS) ?? []) : undefined,
    view: search.view === "starter" ? "starter" : undefined,
  }),
  component: RecipesPage,
});
