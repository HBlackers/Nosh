import { ingredientsRoute } from "@/features/ingredients";
import { recipesRoute } from "@/features/recipes";
import { calendarRoute } from "@/features/schedules";
import { rootRoute } from "./routes/__root";

export const routeTree = rootRoute.addChildren([calendarRoute, recipesRoute, ingredientsRoute]);
