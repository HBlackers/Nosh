import { type AccessibilitySettings, type StoredState, applySettings, loadState, saveState } from "./settings";

let current: StoredState = loadState();
const listeners = new Set<() => void>();

export const getState = () => current;

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

function set(next: StoredState) {
  current = next;
  saveState(current);
  applySettings(current.settings);
  listeners.forEach(listener => listener());
}

export const updateSettings = (change: Partial<AccessibilitySettings>) => set({ ...current, settings: { ...current.settings, ...change } });

export const confirmSettings = () => set({ ...current, configured: true });

export const initAccessibility = () => applySettings(current.settings);
