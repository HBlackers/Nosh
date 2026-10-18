import { queryOptions } from "@tanstack/react-query";
import { type DietaryRequirement, type UserPreferenceResponse, getPreferences, postPreferences, putPreferencesById } from "@/lib/api/generated";

export const preferenceKeys = {
  all: ["preferences"] as const,
};

// The API allows any number of preference rows; this app is for one person, so it always uses the oldest.
export const getPreference = async (signal?: AbortSignal): Promise<UserPreferenceResponse | null> => {
  const { data } = await getPreferences({ query: { Page: 1, PageSize: 1 }, signal, throwOnError: true });
  return data.items[0] ?? null;
};

export const preferenceQuery = () =>
  queryOptions({
    queryKey: preferenceKeys.all,
    queryFn: ({ signal }) => getPreference(signal),
    staleTime: Infinity,
  });

export const savePreference = async (existing: UserPreferenceResponse | null, dietary: DietaryRequirement[]) => {
  if (existing) {
    const { data } = await putPreferencesById({ path: { id: existing.id }, body: { dietary }, throwOnError: true });
    return data;
  }
  const { data } = await postPreferences({ body: { dietary }, throwOnError: true });
  return data;
};
