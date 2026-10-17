import { queryOptions } from "@tanstack/react-query";
import { getSchedules } from "@/lib/api/generated";
import type { ISODate } from "@/lib/dates";

export const scheduleKeys = {
  all: ["schedules"] as const,
  occurrences: (from: ISODate, to: ISODate) => [...scheduleKeys.all, "occurrences", from, to] as const,
};

// A week fits in one page of 100.
export const getOccurrences = async (from: ISODate, to: ISODate, signal?: AbortSignal) => {
  const { data } = await getSchedules({ query: { From: from, To: to, PageSize: 100 }, signal, throwOnError: true });
  return data;
};

export const occurrencesQuery = (from: ISODate, to: ISODate) =>
  queryOptions({
    queryKey: scheduleKeys.occurrences(from, to),
    queryFn: ({ signal }) => getOccurrences(from, to, signal),
  });
