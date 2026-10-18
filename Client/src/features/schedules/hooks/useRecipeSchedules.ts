import { useQuery } from "@tanstack/react-query";
import { recipeSchedulesQuery } from "../api/schedules.queries";

export const useRecipeSchedules = (recipeId: string) => useQuery(recipeSchedulesQuery(recipeId));
