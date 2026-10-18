import { useQuery } from "@tanstack/react-query";
import { type InventoryQuery, inventoryQuery } from "../api/inventory.queries";

export const useInventory = (query: InventoryQuery) => useQuery(inventoryQuery(query));
