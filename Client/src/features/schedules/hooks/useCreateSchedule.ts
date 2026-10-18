import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateStockDependents } from "@/lib/queryKeys";
import { createSchedule } from "../api/schedules.queries";

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => invalidateStockDependents(queryClient),
  });
};
