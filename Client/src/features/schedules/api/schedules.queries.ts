import { queryOptions } from "@tanstack/react-query";
import {
  type CreateScheduleRequest,
  type UpdateScheduleRequest,
  deleteSchedulesById,
  getRecipesByRecipeIdSchedules,
  getSchedules,
  postSchedules,
  putSchedulesById,
} from "@/lib/api/generated";
import type { ISODate } from "@/lib/dates";
import { queryRoots } from "@/lib/queryKeys";

export const scheduleKeys = {
  all: queryRoots.schedules,
  occurrences: (from: ISODate, to: ISODate) => [...scheduleKeys.all, "occurrences", from, to] as const,
  recipe: (recipeId: string) => [...scheduleKeys.all, "recipe", recipeId] as const,
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

export const createSchedule = async (body: CreateScheduleRequest) => {
  const { data } = await postSchedules({ body, throwOnError: true });
  return data;
};

export const updateSchedule = async (id: string, body: UpdateScheduleRequest) => {
  const { data } = await putSchedulesById({ path: { id }, body, throwOnError: true });
  return data;
};

export const deleteSchedule = async (id: string) => {
  await deleteSchedulesById({ path: { id }, throwOnError: true });
};

export const getRecipeSchedules = async (recipeId: string, signal?: AbortSignal) => {
  const { data } = await getRecipesByRecipeIdSchedules({ path: { recipeId }, query: { PageSize: 100 }, signal, throwOnError: true });
  return data;
};

export const recipeSchedulesQuery = (recipeId: string) =>
  queryOptions({
    queryKey: scheduleKeys.recipe(recipeId),
    queryFn: ({ signal }) => getRecipeSchedules(recipeId, signal),
  });
