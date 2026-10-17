import { useQuery } from "@tanstack/react-query";
import type { ISODate } from "@/lib/dates";
import { occurrencesQuery } from "../api/schedules.queries";

export const useScheduleOccurrences = (from: ISODate, to: ISODate) => useQuery(occurrencesQuery(from, to));
