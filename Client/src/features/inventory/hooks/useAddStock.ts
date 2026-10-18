import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateStockDependents } from "@/lib/queryKeys";
import { addStock } from "../api/inventory.queries";

export const useAddStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStock,
    onSuccess: () => invalidateStockDependents(queryClient),
  });
};
