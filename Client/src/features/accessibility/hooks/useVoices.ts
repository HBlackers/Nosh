import { useEffect, useState } from "react";
import { britishVoices, isSpeechSupported } from "../speech";

export function useVoices() {
  const supported = isSpeechSupported();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(britishVoices);

  useEffect(() => {
    if (!supported) {
      return;
    }
    const update = () => setVoices(britishVoices());
    update();
    // Browsers fill the voice list in after the page loads.
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", update);
  }, [supported]);

  return { supported, voices };
}
