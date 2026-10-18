import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateStockDependents } from "@/lib/queryKeys";
import { deleteScheduleEvent } from "../api/scheduleEvents.queries";

export const useUndoOccurrence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteScheduleEvent,
    onSuccess: () => invalidateStockDependents(queryClient),
  });
};
