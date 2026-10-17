import { calendarRoute } from "@/features/schedules";
import { rootRoute } from "./routes/__root";

export const routeTree = rootRoute.addChildren([calendarRoute]);
