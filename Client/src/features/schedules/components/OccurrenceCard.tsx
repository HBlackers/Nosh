import { Check, Repeat, Undo2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Occurrence } from "../calendar";
import { useCompleteOccurrence } from "../hooks/useCompleteOccurrence";
import { useUndoOccurrence } from "../hooks/useUndoOccurrence";
import { OccurrenceDialogContent } from "./OccurrenceDialogContent";
import { OccurrenceStatusTag } from "./OccurrenceStatusTag";
import { occurrenceStatus } from "./occurrenceStatus";

export function OccurrenceCard({ occurrence }: { occurrence: Occurrence }) {
  const [open, setOpen] = useState(false);
  const complete = useCompleteOccurrence();
  const undo = useUndoOccurrence();
  const { stripe, card } = occurrenceStatus(occurrence);
  const { event, recipe, scheduleId, date } = occurrence;
  const failed = complete.isError || undo.isError;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className={cn("rounded-md border-l-4 px-1.5 py-1.5 text-sm", stripe, card)}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="block w-full rounded-sm text-left font-semibold leading-snug wrap-break-word outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {recipe.name}
            {occurrence.isRecurring && <Repeat className="ml-1 inline size-3.5 align-[-2px]" aria-label="Repeats" />}
          </button>
        </DialogTrigger>

        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1">
          <OccurrenceStatusTag occurrence={occurrence} />
          {event ? (
            <Button
              variant="outline"
              size="icon-lg"
              aria-label={`Undo ${recipe.name}`}
              disabled={undo.isPending}
              onClick={() => undo.mutate(event.id)}
            >
              <Undo2 aria-hidden="true" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon-lg"
              aria-label={`Complete ${recipe.name}`}
              disabled={complete.isPending}
              onClick={() => complete.mutate({ scheduleId, date })}
            >
              <Check aria-hidden="true" />
            </Button>
          )}
        </div>

        {failed && (
          <p role="alert" className="mt-1 text-xs">
            That didn't work. Please try again.
          </p>
        )}
      </div>

      <DialogContent className="max-w-2xl">
        <OccurrenceDialogContent occurrence={occurrence} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
