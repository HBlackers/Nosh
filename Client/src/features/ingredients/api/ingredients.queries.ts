import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getIngredients, postIngredients } from "@/lib/api/generated";

export type IngredientsQuery = {
  name?: string;
  page: number;
  pageSize: number;
};

export const ingredientKeys = {
  all: ["ingredients"] as const,
  list: (query: IngredientsQuery) => [...ingredientKeys.all, "list", query] as const,
};

export const getIngredientsPage = async (query: IngredientsQuery, signal?: AbortSignal) => {
  const { data } = await getIngredients({
    query: { Name: query.name, Page: query.page, PageSize: query.pageSize },
    signal,
    throwOnError: true,
  });
  return data;
};

export const ingredientsQuery = (query: IngredientsQuery) =>
  queryOptions({
    queryKey: ingredientKeys.list(query),
    queryFn: ({ signal }) => getIngredientsPage(query, signal),
    placeholderData: keepPreviousData,
  });

export const createIngredient = async (name: string) => {
  const { data } = await postIngredients({ body: { name }, throwOnError: true });
  return data;
};

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

const findIngredient = async (name: string) => {
  const page = await getIngredientsPage({ name, page: 1, pageSize: 100 });
  return page.items.find(item => sameName(item.name, name));
};

export const ensureIngredient = async (name: string) => {
  const existing = await findIngredient(name);
  if (existing) {
    return existing;
  }
  try {
    return await createIngredient(name.trim());
  } catch (error) {
    // A parallel request may have created it between the search and the create.
    const created = await findIngredient(name);
    if (created) {
      return created;
    }
    throw error;
  }
};
