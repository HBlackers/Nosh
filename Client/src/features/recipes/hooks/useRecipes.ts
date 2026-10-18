import { useQuery } from "@tanstack/react-query";
import { type RecipesQuery, recipesQuery } from "../api/recipes.queries";

export const useRecipes = (query: RecipesQuery, options?: { enabled?: boolean }) =>
  useQuery({ ...recipesQuery(query), enabled: options?.enabled ?? true });
