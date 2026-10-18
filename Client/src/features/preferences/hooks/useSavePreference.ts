import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DietaryRequirement, UserPreferenceResponse } from "@/lib/api/generated";
import { preferenceKeys, savePreference } from "../api/preferences.queries";

type SavePreferenceVariables = {
  existing: UserPreferenceResponse | null;
  dietary: DietaryRequirement[];
};

// The callback is passed to the hook, not to mutate(): saving closes the first-visit dialog, which unmounts the form that called mutate.
export const useSavePreference = (onSaved?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ existing, dietary }: SavePreferenceVariables) => savePreference(existing, dietary),
    onSuccess: saved => {
      queryClient.setQueryData(preferenceKeys.all, saved);
      onSaved?.();
    },
  });
};
