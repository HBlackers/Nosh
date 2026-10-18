import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { SampleRecipeResponse } from "@/lib/api/generated";
import { AddSampleButton } from "./AddSampleButton";
import { RecipeDetails } from "./RecipeDetails";

type SampleRecipeDialogProps = {
  sample: SampleRecipeResponse | null;
  onClose: () => void;
};

export function SampleRecipeDialog({ sample, onClose }: SampleRecipeDialogProps) {
  return (
    <Dialog open={sample !== null} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        {sample && (
          <>
            <DialogHeader>
              <DialogTitle>{sample.name}</DialogTitle>
              <DialogDescription>A starter recipe. Add it to your recipes to plan it.</DialogDescription>
            </DialogHeader>

            <RecipeDetails
              cuisine={sample.cuisine}
              serves={sample.serves}
              mealTypes={sample.mealTypes}
              dietary={sample.dietary}
              lines={sample.ingredients.map(line => ({ name: line.item, quantity: line.quantity, unit: line.unit, prep: line.prep }))}
              method={sample.method}
            />

            <DialogFooter>
              <AddSampleButton sample={sample} />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
