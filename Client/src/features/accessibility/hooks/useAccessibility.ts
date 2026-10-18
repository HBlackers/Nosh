import { useSyncExternalStore } from "react";
import { DEFAULT_SETTINGS } from "../settings";
import { confirmSettings, getState, subscribe, updateSettings } from "../store";

export const useAccessibility = () => {
  const state = useSyncExternalStore(subscribe, getState);
  return {
    settings: state.settings,
    configured: state.configured,
    update: updateSettings,
    confirm: confirmSettings,
    reset: () => updateSettings(DEFAULT_SETTINGS),
  };
};
