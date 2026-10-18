import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { usePreference } from "../hooks/usePreference";
import { PreferencesForm } from "./PreferencesForm";

export function PreferencesButton() {
  const [open, setOpen] = useState(false);
  const { data: preference } = usePreference();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex min-h-14 w-full items-center gap-4 rounded-lg px-3 py-2.5 text-left text-xl font-semibold text-cloud-grey lg:min-h-11 lg:gap-3 lg:text-base hover:bg-charcoal-raised hover:text-nosh-green focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <SlidersHorizontal className="size-6 lg:size-5" aria-hidden="true" />
          Preferences
        </button>
      </DialogTrigger>
      <DialogContent>
        <PreferencesForm existing={preference ?? null} firstVisit={false} onSaved={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
