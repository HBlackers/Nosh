import { useQuery } from "@tanstack/react-query";
import type { ISODate } from "@/lib/dates";
import { shoppingListQuery } from "../api/shoppingList.queries";

export const useShoppingList = (from: ISODate, to: ISODate) => useQuery(shoppingListQuery(from, to));
