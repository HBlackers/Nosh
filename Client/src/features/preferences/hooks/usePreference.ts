import { useQuery } from "@tanstack/react-query";
import { preferenceQuery } from "../api/preferences.queries";

export const usePreference = () => useQuery(preferenceQuery());
