import { createRoute } from "@tanstack/react-router";
import { parsePage, parseText } from "@/lib/search";
import { rootRoute } from "@/routes/__root";
import { InventoryPage } from "./pages/InventoryPage";

export const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/inventory",
  validateSearch: (search: Record<string, unknown>): { q?: string; page?: number } => ({
    q: parseText(search.q),
    page: parsePage(search.page),
  }),
  component: InventoryPage,
});
