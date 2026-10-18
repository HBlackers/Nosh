import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {
  type AddStockRequest,
  type UpdateInventoryItemRequest,
  deleteInventoryById,
  getInventory,
  postInventory,
  putInventoryById,
} from "@/lib/api/generated";
import { queryRoots } from "@/lib/queryKeys";

export type InventoryQuery = {
  name?: string;
  page: number;
  pageSize: number;
};

export const inventoryKeys = {
  all: queryRoots.inventory,
  list: (query: InventoryQuery) => [...queryRoots.inventory, "list", query] as const,
};

export const getInventoryPage = async (query: InventoryQuery, signal?: AbortSignal) => {
  const { data } = await getInventory({
    query: { Name: query.name, Page: query.page, PageSize: query.pageSize },
    signal,
    throwOnError: true,
  });
  return data;
};

export const inventoryQuery = (query: InventoryQuery) =>
  queryOptions({
    queryKey: inventoryKeys.list(query),
    queryFn: ({ signal }) => getInventoryPage(query, signal),
    placeholderData: keepPreviousData,
  });

export const addStock = async (body: AddStockRequest) => {
  const { data } = await postInventory({ body, throwOnError: true });
  return data;
};

export const updateStock = async (id: string, body: UpdateInventoryItemRequest) => {
  const { data } = await putInventoryById({ path: { id }, body, throwOnError: true });
  return data;
};

export const deleteStock = async (id: string) => {
  await deleteInventoryById({ path: { id }, throwOnError: true });
};
