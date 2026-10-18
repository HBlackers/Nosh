import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateStockDependents } from "@/lib/queryKeys";
import { deleteStock } from "../api/inventory.queries";

export const useDeleteStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStock,
    onSuccess: () => invalidateStockDependents(queryClient),
  });
};
