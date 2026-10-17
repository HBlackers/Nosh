import { homeRoute } from "@/features/home";
import { rootRoute } from "./routes/__root";

// Compose each feature's routes here.
export const routeTree = rootRoute.addChildren([homeRoute]);
