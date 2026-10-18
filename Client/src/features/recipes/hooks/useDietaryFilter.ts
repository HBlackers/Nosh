import { getRouteApi } from "@tanstack/react-router";
import { useCallback } from "react";
import { usePreference } from "@/features/preferences";
import type { DietaryRequirement } from "@/lib/api/generated";

const route = getRouteApi("/recipes");

// The saved dietary preference is the starting filter; picking tags (or All) overrides it for this view through the URL.
export function useDietaryFilter() {
  const { dietary } = route.useSearch();
  const navigate = route.useNavigate();
  const preference = usePreference();

  const select = useCallback(
    (next: DietaryRequirement[]) => void navigate({ search: previous => ({ ...previous, dietary: next, page: undefined }) }),
    [navigate],
  );

  return {
    selected: dietary ?? preference.data?.dietary ?? [],
    select,
    ready: dietary !== undefined || preference.isSuccess,
  };
}
