import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { loadDyslexiaFont } from "../fontLoader";
import { useAccessibility } from "../hooks/useAccessibility";
import { TEXT_SIZES } from "../settings";

export function AccessibilityForm() {
  const { settings, update, reset } = useAccessibility();

  useEffect(() => {
    void loadDyslexiaFont();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle>Accessibility</DialogTitle>
        <DialogDescription>Make Nosh easier to read. These are saved on this device.</DialogDescription>
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

      <DialogFooter>
        <Button type="button" variant="outline" size="lg" onClick={reset}>
          Reset to defaults
        </Button>
        <DialogClose asChild>
          <Button type="button" size="lg">
            Done
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}
