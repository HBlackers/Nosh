import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadDyslexiaFont } from "../fontLoader";
import { useAccessibility } from "../hooks/useAccessibility";
import { useReadAloud } from "../hooks/useReadAloud";
import { useVoices } from "../hooks/useVoices";
import { SPEECH_RATES, TEXT_SIZES } from "../settings";

const SAMPLE = ["This is how Nosh will read to you."];

type AccessibilityFormProps = {
  // The first-visit dialog: the defaults are already picked, and Continue confirms them.
  firstVisit?: boolean;
};

export function AccessibilityForm({ firstVisit = false }: AccessibilityFormProps) {
  const { settings, update, reset, confirm } = useAccessibility();
  const { supported, voices } = useVoices();
  const sample = useReadAloud("settings-sample");

  useEffect(() => {
    void loadDyslexiaFont();
  }, []);

  const canRead = supported && voices.length > 0;
  const voiceURI = voices.find(voice => voice.voiceURI === settings.voiceURI)?.voiceURI ?? voices[0]?.voiceURI;

  return (
    <div className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle>{firstVisit ? "Welcome to Nosh" : "Accessibility"}</DialogTitle>
        <DialogDescription>
          {firstVisit
            ? "Let's make Nosh comfortable to use. We've picked the usual settings; change anything you like. You can come back to this at any time."
            : "Make Nosh easier to read. These are saved on this device."}
        </DialogDescription>
      </DialogHeader>

      <fieldset className="space-y-2">
        <legend className="font-semibold">Text size</legend>
        <div role="group" aria-label="Text size" className="flex flex-wrap gap-2">
          {TEXT_SIZES.map(size => (
            <Button
              key={size.id}
              type="button"
              className="h-10"
              variant={settings.textSize === size.id ? "default" : "outline"}
              aria-pressed={settings.textSize === size.id}
              onClick={() => update({ textSize: size.id })}
            >
              {size.label}
            </Button>
          ))}
        </div>
        <p className="text-muted-foreground">Normal is the default. Everything on the page grows or shrinks with it.</p>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="font-semibold">Font</legend>
        <div role="group" aria-label="Font" className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="h-10"
            variant={settings.dyslexiaFont ? "outline" : "default"}
            aria-pressed={!settings.dyslexiaFont}
            onClick={() => update({ dyslexiaFont: false })}
          >
            Standard
          </Button>
          <Button
            type="button"
            className="h-10 font-[family-name:OpenDyslexic]"
            variant={settings.dyslexiaFont ? "default" : "outline"}
            aria-pressed={settings.dyslexiaFont}
            onClick={() => update({ dyslexiaFont: true })}
          >
            Dyslexia-friendly
          </Button>
        </div>
        <p className="text-muted-foreground">The dyslexia-friendly option uses the OpenDyslexic font for everything.</p>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="font-semibold">Read aloud</legend>
        <div role="group" aria-label="Read aloud" className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="h-10"
            variant={settings.readAloud ? "outline" : "default"}
            aria-pressed={!settings.readAloud}
            onClick={() => update({ readAloud: false })}
          >
            Off
          </Button>
          <Button
            type="button"
            className="h-10"
            variant={settings.readAloud ? "default" : "outline"}
            aria-pressed={settings.readAloud}
            disabled={!canRead}
            onClick={() => update({ readAloud: true })}
          >
            On
          </Button>
        </div>
        <p className="text-muted-foreground">
          {canRead
            ? "Adds a Read aloud button to recipes, meals and your shopping list."
            : "This device has no UK English voice, so read aloud isn't available here."}
        </p>

        {settings.readAloud && canRead && (
          <div className="space-y-3 pt-1">
            <div className="space-y-2">
              <label htmlFor="voice" className="block font-semibold">
                Voice
              </label>
              <Select value={voiceURI} onValueChange={value => update({ voiceURI: value })}>
                <SelectTrigger id="voice" className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map(voice => (
                    <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div role="group" aria-label="Speed" className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">Speed</span>
              {SPEECH_RATES.map(rate => (
                <Button
                  key={rate.id}
                  type="button"
                  className="h-10"
                  variant={settings.speechRate === rate.id ? "default" : "outline"}
                  aria-pressed={settings.speechRate === rate.id}
                  onClick={() => update({ speechRate: rate.id })}
                >
                  {rate.label}
                </Button>
              ))}
            </div>

            <Button type="button" variant="outline" size="lg" onClick={() => sample.play(SAMPLE)}>
              Try it
            </Button>
          </div>
        )}
      </fieldset>

      <DialogFooter>
        {firstVisit ? (
          <Button type="button" size="lg" onClick={confirm}>
            Continue
          </Button>
        ) : (
          <>
            <Button type="button" variant="outline" size="lg" onClick={reset}>
              Reset to defaults
            </Button>
            <DialogClose asChild>
              <Button type="button" size="lg">
                Done
              </Button>
            </DialogClose>
          </>
        )}
      </DialogFooter>
    </div>
  );
}
