import { type ScheduleEventStatus, deleteScheduleEventsById, postScheduleEvents } from "@/lib/api/generated";
import type { ISODate } from "@/lib/dates";

export const createScheduleEvent = async (scheduleId: string, date: ISODate, status: ScheduleEventStatus) => {
  const { data } = await postScheduleEvents({ body: { scheduleId, date, status }, throwOnError: true });
  return data;
};

export const deleteScheduleEvent = async (id: string) => {
  await deleteScheduleEventsById({ path: { id }, throwOnError: true });
};
