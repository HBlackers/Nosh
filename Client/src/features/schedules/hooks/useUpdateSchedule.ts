import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateScheduleRequest } from "@/lib/api/generated";
import { invalidateStockDependents } from "@/lib/queryKeys";
import { updateSchedule } from "../api/schedules.queries";

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateScheduleRequest }) => updateSchedule(id, body),
    onSuccess: () => invalidateStockDependents(queryClient),
  });
};
