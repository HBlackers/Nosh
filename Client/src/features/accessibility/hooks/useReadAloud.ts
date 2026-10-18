import { useCallback, useEffect } from "react";
import { pauseSpeech, playSpeech, resumeSpeech, stopSpeech, stopSpeechFor, useSpeechState } from "../speech";
import { speechRateOf } from "../settings";
import { useAccessibility } from "./useAccessibility";
import { useVoices } from "./useVoices";

// `owner` names what is being read (a recipe, the shopping list) so only that part of the page shows it as playing.
export function useReadAloud(owner: string) {
  const { settings } = useAccessibility();
  const { supported, voices } = useVoices();
  const state = useSpeechState();
  const mine = state.owner === owner;
  const { voiceURI, speechRate } = settings;

  useEffect(() => () => stopSpeechFor(owner), [owner]);

  const play = useCallback(
    (lines: string[], from = 0) => playSpeech({ owner, lines, voiceURI, rate: speechRateOf(speechRate) }, from),
    [owner, voiceURI, speechRate],
  );

  return {
    enabled: settings.readAloud && supported && voices.length > 0,
    status: mine ? state.status : ("idle" as const),
    index: mine ? state.index : -1,
    play,
    pause: pauseSpeech,
    resume: resumeSpeech,
    stop: stopSpeech,
  };
}
