import type { QueryClient } from "@tanstack/react-query";

export const queryRoots = {
  schedules: ["schedules"] as const,
  inventory: ["inventory"] as const,
  shoppingList: ["shopping-list"] as const,
};

// Stock feeds the calendar's availability and the shopping list, and completing a meal changes stock, so they refresh together.
export const invalidateStockDependents = (queryClient: QueryClient) =>
  Promise.all(Object.values(queryRoots).map(queryKey => queryClient.invalidateQueries({ queryKey })));
