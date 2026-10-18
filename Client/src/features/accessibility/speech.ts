import { useSyncExternalStore } from "react";

export type SpeechStatus = "idle" | "speaking" | "paused";
export type SpeechState = { owner: string | null; index: number; status: SpeechStatus };
type Session = { owner: string; lines: string[]; voiceURI: string | null; rate: number };

const IDLE: SpeechState = { owner: null, index: -1, status: "idle" };

let state = IDLE;
let session: Session | null = null;
let token = 0;
// Kept in a variable because some browsers drop an utterance's events once it has been garbage collected.
let utterance: SpeechSynthesisUtterance | null = null;
const listeners = new Set<() => void>();

const set = (next: SpeechState) => {
  state = next;
  listeners.forEach(listener => listener());
};

export const isSpeechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

// Android reports "en_GB", desktop browsers "en-GB".
export const isBritishVoice = (voice: SpeechSynthesisVoice) => voice.lang.replace("_", "-").toLowerCase() === "en-gb";

export const britishVoices = () => (isSpeechSupported() ? window.speechSynthesis.getVoices().filter(isBritishVoice) : []);

const pickVoice = (voiceURI: string | null) => {
  const voices = britishVoices();
  return voices.find(voice => voice.voiceURI === voiceURI) ?? voices[0];
};

function speakLine(mine: number, index: number) {
  if (mine !== token || !session) {
    return;
  }
  if (index >= session.lines.length) {
    session = null;
    set(IDLE);
    return;
  }

  const next = new SpeechSynthesisUtterance(session.lines[index]);
  next.lang = "en-GB";
  next.rate = session.rate;
  const voice = pickVoice(session.voiceURI);
  if (voice) {
    next.voice = voice;
  }
  next.onend = () => speakLine(mine, index + 1);
  next.onerror = event => {
    if (mine === token && event.error !== "canceled" && event.error !== "interrupted") {
      stopSpeech();
    }
  };

  utterance = next;
  set({ owner: session.owner, index, status: "speaking" });
  window.speechSynthesis.speak(next);
}

export function playSpeech(next: Session, from = 0) {
  if (!isSpeechSupported()) {
    return;
  }
  token += 1;
  window.speechSynthesis.cancel();
  session = next;
  speakLine(token, from);
}

// Pause stops and remembers the line, then resume starts that line again: pause()/resume() on speechSynthesis itself is unreliable on phones.
export function pauseSpeech() {
  if (!session || state.status !== "speaking") {
    return;
  }
  token += 1;
  window.speechSynthesis.cancel();
  set({ ...state, status: "paused" });
}

export function resumeSpeech() {
  if (!session || state.status !== "paused") {
    return;
  }
  token += 1;
  speakLine(token, state.index);
}

export function stopSpeech() {
  token += 1;
  session = null;
  utterance = null;
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
  set(IDLE);
}

export function stopSpeechFor(owner: string) {
  if (state.owner === owner) {
    stopSpeech();
  }
}

export const getSpeechState = () => state;

export const subscribeSpeech = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useSpeechState = () => useSyncExternalStore(subscribeSpeech, getSpeechState);
