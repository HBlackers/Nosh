import { useSyncExternalStore } from "react";
import { DEFAULT_SETTINGS } from "../settings";
import { getSettings, subscribe, updateSettings } from "../store";

export const useAccessibility = () => ({
  settings: useSyncExternalStore(subscribe, getSettings),
  update: updateSettings,
  reset: () => updateSettings(DEFAULT_SETTINGS),
});
