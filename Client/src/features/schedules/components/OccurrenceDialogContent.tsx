import { Check, CircleX, SkipForward, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReadAloudControls } from "@/features/accessibility";
import { StockQuickAdd } from "@/features/inventory";
import { useRecipe } from "@/features/recipes";
import type { LackingIngredientResponse, RecipeIngredientResponse } from "@/lib/api/generated";
import { formatWeekdayLong, parseISODate } from "@/lib/dates";
import { formatQuantity, spokenQuantity, toNumber } from "@/lib/quantity";
import type { Occurrence } from "../calendar";
import { useCompleteOccurrence } from "../hooks/useCompleteOccurrence";
import { useSkipOccurrence } from "../hooks/useSkipOccurrence";
import { useUndoOccurrence } from "../hooks/useUndoOccurrence";
import { OccurrenceStatusTag } from "./OccurrenceStatusTag";

type OccurrenceDialogContentProps = {
  occurrence: Occurrence;
  onDone: () => void;
};

function suggestedAmount({ needed, available }: LackingIngredientResponse) {
  if (!needed) {
    return { amount: 1, unit: null };
  }
  const shortfall = available && available.unit === needed.unit ? toNumber(needed.amount) - toNumber(available.amount) : toNumber(needed.amount);
  return { amount: shortfall, unit: needed.unit };
}

function mealSpeech(occurrence: Occurrence): string[] {
  const { event, availability, recipe, mealType, date } = occurrence;
  const status = event
    ? event.status === "Completed"
      ? "This meal is done."
      : "This meal was skipped."
    : availability?.status === "Ready"
      ? "You have everything you need."
      : availability?.status === "Partial"
        ? "You have some of what you need."
        : "You don't have any of what you need.";

  return [
    `${recipe.name}, for ${mealType.toLowerCase()} on ${formatWeekdayLong(parseISODate(date))}.`,
    status,
    ...(availability?.lacking ?? []).map(
      item =>
        `${item.ingredientName}: you need ${item.needed ? spokenQuantity(item.needed.amount, item.needed.unit) : "some"}, and you have ${
          item.available ? spokenQuantity(item.available.amount, item.available.unit) : "none"
        }.`,
    ),
  ];
}

export function OccurrenceDialogContent({ occurrence, onDone }: OccurrenceDialogContentProps) {
  const { event, availability, scheduleId, date } = occurrence;
  const recipe = useRecipe(occurrence.recipe.id);
  const complete = useCompleteOccurrence();
  const skip = useSkipOccurrence();
  const undo = useUndoOccurrence();
  const busy = complete.isPending || skip.isPending || undo.isPending;
  const failed = complete.isError || skip.isError || undo.isError;

  const mutation = { onSuccess: onDone };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{occurrence.recipe.name}</DialogTitle>
        <DialogDescription>
          {occurrence.mealType} · {formatWeekdayLong(parseISODate(date))}
        </DialogDescription>
        <div>
          <OccurrenceStatusTag occurrence={occurrence} />
        </div>
      </DialogHeader>

      <ReadAloudControls owner={`meal-${scheduleId}-${date}`} lines={mealSpeech(occurrence)} label="Read this aloud" />

      {recipe.isPending && <p className="text-muted-foreground">Loading the recipe…</p>}
      {recipe.isError && (
        <div className="space-y-3">
          <p>We couldn't load this recipe.</p>
          <Button variant="outline" size="lg" onClick={() => void recipe.refetch()}>
            Try again
          </Button>
        </div>
      )}

      {recipe.data && (
        <>
          <section aria-labelledby="occurrence-ingredients" className="space-y-2">
            <h3 id="occurrence-ingredients" className="text-lg">
              Ingredients
            </h3>
            <ul className="divide-y rounded-lg border">
              {recipe.data.ingredients.map(line => (
                <IngredientRow key={line.id} line={line} lacking={availability?.lacking.find(l => l.ingredientId === line.ingredientId)} checked={availability !== null} />
              ))}
            </ul>
          </section>

          {recipe.data.method.length > 0 && (
            <section aria-labelledby="occurrence-method" className="space-y-2">
              <h3 id="occurrence-method" className="text-lg">
                Method
              </h3>
              <ol className="list-decimal space-y-2 pl-5">
                {recipe.data.method.map(step => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}

      {availability && availability.status !== "Ready" && (
        <p className="text-muted-foreground">You're short on some ingredients. Completing this uses up what you do have.</p>
      )}

      {failed && (
        <p role="alert" className="text-base">
          That didn't work. Please try again.
        </p>
      )}

      <DialogFooter>
        {event ? (
          <Button variant="outline" size="lg" disabled={busy} onClick={() => undo.mutate(event.id, mutation)}>
            <Undo2 aria-hidden="true" />
            Undo
          </Button>
        ) : (
          <>
            <Button variant="outline" size="lg" disabled={busy} onClick={() => skip.mutate({ scheduleId, date }, mutation)}>
              <SkipForward aria-hidden="true" />
              Skip
            </Button>
            <Button size="lg" disabled={busy} onClick={() => complete.mutate({ scheduleId, date }, mutation)}>
              <Check aria-hidden="true" />
              Complete
            </Button>
          </>
        )}
      </DialogFooter>
    </>
  );
}

type IngredientRowProps = {
  line: RecipeIngredientResponse;
  lacking: LackingIngredientResponse | undefined;
  checked: boolean;
};

function IngredientRow({ line, lacking, checked }: IngredientRowProps) {
  return (
    <li className="space-y-2 px-3 py-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{line.ingredientName}</p>
          {line.prep && <p className="text-base text-muted-foreground">{line.prep}</p>}
        </div>
        <p className="shrink-0">{line.quantity === null ? "To taste" : formatQuantity(line.quantity, line.unit)}</p>
      </div>

      {checked && !lacking && (
        <p className="flex items-center gap-1.5 text-base text-muted-foreground">
          <Check className="size-4" aria-hidden="true" />
          In stock
        </p>
      )}

      {lacking && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-base">
            <CircleX className="size-4 text-destructive" aria-hidden="true" />
            {lacking.available ? `You have ${formatQuantity(lacking.available.amount, lacking.available.unit)}` : "None in stock"}
          </p>
          <StockQuickAdd ingredientId={lacking.ingredientId} ingredientName={lacking.ingredientName} suggested={suggestedAmount(lacking)} />
        </div>
      )}
    </li>
  );
}
