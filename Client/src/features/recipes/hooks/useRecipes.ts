import { useQuery } from "@tanstack/react-query";
import { type RecipesQuery, recipesQuery } from "../api/recipes.queries";

export const useRecipes = (query: RecipesQuery) => useQuery(recipesQuery(query));
