import { loadDyslexiaFont } from "./fontLoader";

export const TEXT_SIZES = [
  { id: "smaller", label: "Smaller", scale: 0.875 },
  { id: "normal", label: "Normal", scale: 1 },
  { id: "large", label: "Large", scale: 1.125 },
  { id: "larger", label: "Larger", scale: 1.25 },
  { id: "largest", label: "Largest", scale: 1.5 },
] as const;

export const SPEECH_RATES = [
  { id: "slower", label: "Slower", rate: 0.8 },
  { id: "normal", label: "Normal", rate: 1 },
  { id: "faster", label: "Faster", rate: 1.25 },
] as const;

export type TextSizeId = (typeof TEXT_SIZES)[number]["id"];
export type SpeechRateId = (typeof SPEECH_RATES)[number]["id"];

export type AccessibilitySettings = {
  textSize: TextSizeId;
  dyslexiaFont: boolean;
  readAloud: boolean;
  voiceURI: string | null;
  speechRate: SpeechRateId;
};

export type StoredState = {
  settings: AccessibilitySettings;
  // False until the person has been through the first-visit dialog, which pre-picks these defaults for them to confirm.
  configured: boolean;
};

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: "normal",
  dyslexiaFont: false,
  readAloud: false,
  voiceURI: null,
  speechRate: "normal",
};

const STORAGE_KEY = "nosh.accessibility";

const isTextSize = (value: unknown): value is TextSizeId => TEXT_SIZES.some(size => size.id === value);
const isSpeechRate = (value: unknown): value is SpeechRateId => SPEECH_RATES.some(rate => rate.id === value);

export const speechRateOf = (id: SpeechRateId) => SPEECH_RATES.find(rate => rate.id === id)?.rate ?? 1;

export function loadState(): StoredState {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as (Partial<AccessibilitySettings> & { configured?: boolean }) | null;
    if (!stored) {
      return { settings: DEFAULT_SETTINGS, configured: false };
    }
    return {
      settings: {
        textSize: isTextSize(stored.textSize) ? stored.textSize : DEFAULT_SETTINGS.textSize,
        dyslexiaFont: stored.dyslexiaFont === true,
        readAloud: stored.readAloud === true,
        voiceURI: typeof stored.voiceURI === "string" ? stored.voiceURI : null,
        speechRate: isSpeechRate(stored.speechRate) ? stored.speechRate : DEFAULT_SETTINGS.speechRate,
      },
      // Settings saved before the first-visit dialog existed count as confirmed.
      configured: stored.configured !== false,
    };
  } catch {
    return { settings: DEFAULT_SETTINGS, configured: false };
  }
}

export function saveState(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state.settings, configured: state.configured }));
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
