import { User } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AccessibilityForm } from "./AccessibilityForm";

export function AccessibilityButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex min-h-14 w-full items-center gap-4 rounded-lg px-3 py-2.5 text-left text-xl font-semibold text-cloud-grey hover:bg-charcoal-raised hover:text-nosh-green focus-visible:ring-[3px] focus-visible:ring-nosh-green focus-visible:outline-none lg:min-h-11 lg:gap-3 lg:text-base"
        >
          <User className="size-6 shrink-0 lg:size-5" aria-hidden="true" />
          Accessibility
        </button>
      </DialogTrigger>
      <DialogContent>
        <AccessibilityForm />
      </DialogContent>
    </Dialog>
  );
}
