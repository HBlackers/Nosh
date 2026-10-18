import { type AccessibilitySettings, applySettings, loadSettings, saveSettings } from "./settings";

let current = loadSettings();
const listeners = new Set<() => void>();

export const getSettings = () => current;

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function updateSettings(change: Partial<AccessibilitySettings>) {
  current = { ...current, ...change };
  saveSettings(current);
  applySettings(current);
  listeners.forEach(listener => listener());
}

export const initAccessibility = () => applySettings(current);
