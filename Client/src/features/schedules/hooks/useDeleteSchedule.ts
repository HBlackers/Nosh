import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateStockDependents } from "@/lib/queryKeys";
import { deleteSchedule } from "../api/schedules.queries";

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => invalidateStockDependents(queryClient),
  });
};
