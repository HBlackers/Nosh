import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { type CreateRecipeRequest, type DietaryRequirement, getRecipes, postRecipes } from "@/lib/api/generated";

export type RecipesQuery = {
  name?: string;
  dietary?: DietaryRequirement[];
  page: number;
  pageSize: number;
};

export const recipeKeys = {
  all: ["recipes"] as const,
  list: (query: RecipesQuery) => [...recipeKeys.all, "list", query] as const,
};

export const getRecipesPage = async (query: RecipesQuery, signal?: AbortSignal) => {
  const { data } = await getRecipes({
    query: { Name: query.name, Dietary: query.dietary, Page: query.page, PageSize: query.pageSize },
    signal,
    throwOnError: true,
  });
  return data;
};

export const recipesQuery = (query: RecipesQuery) =>
  queryOptions({
    queryKey: recipeKeys.list(query),
    queryFn: ({ signal }) => getRecipesPage(query, signal),
    placeholderData: keepPreviousData,
  });

export const createRecipe = async (body: CreateRecipeRequest) => {
  const { data } = await postRecipes({ body, throwOnError: true });
  return data;
};
