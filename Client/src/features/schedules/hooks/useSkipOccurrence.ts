import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ISODate } from "@/lib/dates";
import { invalidateStockDependents } from "@/lib/queryKeys";
import { createScheduleEvent } from "../api/scheduleEvents.queries";

export const useSkipOccurrence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, date }: { scheduleId: string; date: ISODate }) => createScheduleEvent(scheduleId, date, "Skipped"),
    onSuccess: () => invalidateStockDependents(queryClient),
  });
};
