import { loadDyslexiaFont } from "./fontLoader";

export const TEXT_SIZES = [
  { id: "smaller", label: "Smaller", scale: 0.875 },
  { id: "normal", label: "Normal", scale: 1 },
  { id: "large", label: "Large", scale: 1.125 },
  { id: "larger", label: "Larger", scale: 1.25 },
  { id: "largest", label: "Largest", scale: 1.5 },
] as const;

export type TextSizeId = (typeof TEXT_SIZES)[number]["id"];

export type AccessibilitySettings = {
  textSize: TextSizeId;
  dyslexiaFont: boolean;
};

export const DEFAULT_SETTINGS: AccessibilitySettings = { textSize: "normal", dyslexiaFont: false };

const STORAGE_KEY = "nosh.accessibility";

const isTextSize = (value: unknown): value is TextSizeId => TEXT_SIZES.some(size => size.id === value);

export function loadSettings(): AccessibilitySettings {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<AccessibilitySettings> | null;
    return {
      textSize: isTextSize(stored?.textSize) ? stored.textSize : DEFAULT_SETTINGS.textSize,
      dyslexiaFont: stored?.dyslexiaFont === true,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AccessibilitySettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Private windows can block storage; the settings still apply until the page is closed.
  }
}

// A percentage of the root size, so a bigger text size chosen in the browser still counts. Everything is in rem, so the whole layout scales with it.
export function applySettings(settings: AccessibilitySettings) {
  const scale = TEXT_SIZES.find(size => size.id === settings.textSize)?.scale ?? 1;
  document.documentElement.style.fontSize = `${scale * 100}%`;
  if (settings.dyslexiaFont) {
    void loadDyslexiaFont();
    document.documentElement.dataset.font = "dyslexic";
  } else {
    delete document.documentElement.dataset.font;
  }
}
