import { useQuery } from "@tanstack/react-query";
import { type SamplesQuery, samplesQuery } from "../api/recipes.queries";

export const useSampleRecipes = (query: SamplesQuery, options?: { enabled?: boolean }) =>
  useQuery({ ...samplesQuery(query), enabled: options?.enabled ?? true });
