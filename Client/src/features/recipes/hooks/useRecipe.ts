import { useQuery } from "@tanstack/react-query";
import { recipeQuery } from "../api/recipes.queries";

export const useRecipe = (id: string) => useQuery(recipeQuery(id));
