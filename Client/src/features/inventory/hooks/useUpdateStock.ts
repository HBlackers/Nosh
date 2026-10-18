import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateInventoryItemRequest } from "@/lib/api/generated";
import { invalidateStockDependents } from "@/lib/queryKeys";
import { updateStock } from "../api/inventory.queries";

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateInventoryItemRequest }) => updateStock(id, body),
    onSuccess: () => invalidateStockDependents(queryClient),
  });
};
