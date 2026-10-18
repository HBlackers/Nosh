import { ingredientsRoute } from "@/features/ingredients";
import { inventoryRoute } from "@/features/inventory";
import { recipesRoute } from "@/features/recipes";
import { calendarRoute } from "@/features/schedules";
import { shoppingListRoute } from "@/features/shopping-list";
import { rootRoute } from "./routes/__root";

export const routeTree = rootRoute.addChildren([calendarRoute, shoppingListRoute, recipesRoute, ingredientsRoute, inventoryRoute]);
