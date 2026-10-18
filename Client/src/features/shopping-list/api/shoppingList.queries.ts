import { queryOptions } from "@tanstack/react-query";
import { getShoppingList } from "@/lib/api/generated";
import type { ISODate } from "@/lib/dates";
import { queryRoots } from "@/lib/queryKeys";

export const shoppingListKeys = {
  all: queryRoots.shoppingList,
  range: (from: ISODate, to: ISODate) => [...queryRoots.shoppingList, from, to] as const,
};

export const getShoppingListForRange = async (from: ISODate, to: ISODate, signal?: AbortSignal) => {
  const { data } = await getShoppingList({ query: { From: from, To: to }, signal, throwOnError: true });
  return data;
};

export const shoppingListQuery = (from: ISODate, to: ISODate) =>
  queryOptions({
    queryKey: shoppingListKeys.range(from, to),
    queryFn: ({ signal }) => getShoppingListForRange(from, to, signal),
  });
