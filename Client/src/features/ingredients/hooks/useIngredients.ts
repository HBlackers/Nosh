import { useQuery } from "@tanstack/react-query";
import { type IngredientsQuery, ingredientsQuery } from "../api/ingredients.queries";

export const useIngredients = (query: IngredientsQuery, options?: { enabled?: boolean }) =>
  useQuery({ ...ingredientsQuery(query), enabled: options?.enabled ?? true });
