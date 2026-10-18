import { useState } from "react";
import { Tabs } from "@/components/Tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecipeSchedulesPanel } from "@/features/schedules";
import type { RecipeSummaryResponse } from "@/lib/api/generated";
import { useRecipe } from "../hooks/useRecipe";
import { RecipeDetails } from "./RecipeDetails";

type Tab = "details" | "schedules";

const tabs: { id: Tab; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "schedules", label: "Schedules" },
];

type RecipeDialogProps = {
  recipe: RecipeSummaryResponse | null;
  onClose: () => void;
};

export function RecipeDialog({ recipe, onClose }: RecipeDialogProps) {
  return (
    <Dialog open={recipe !== null} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl">{recipe && <RecipeDialogContent recipe={recipe} />}</DialogContent>
    </Dialog>
  );
}

function RecipeDialogContent({ recipe }: { recipe: RecipeSummaryResponse }) {
  const [tab, setTab] = useState<Tab>("details");
  const { data, isPending, isError, refetch } = useRecipe(recipe.id);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{recipe.name}</DialogTitle>
        <DialogDescription>
          {recipe.cuisine} · Serves {recipe.serves}
        </DialogDescription>
      </DialogHeader>

      <Tabs label="Recipe" tabs={tabs} value={tab} onChange={setTab} />

      {tab === "details" && (
        <div role="tabpanel" aria-label="Details">
          {isPending && <p className="text-muted-foreground">Loading the recipe…</p>}
          {isError && (
            <div className="space-y-3">
              <p>We couldn't load this recipe.</p>
              <Button variant="outline" size="lg" onClick={() => void refetch()}>
                Try again
              </Button>
            </div>
          )}
          {data && (
            <RecipeDetails
              cuisine={data.cuisine}
              serves={data.serves}
              mealTypes={data.mealTypes}
              dietary={data.dietary}
              lines={data.ingredients.map(line => ({ name: line.ingredientName, quantity: line.quantity, unit: line.unit, prep: line.prep }))}
              method={data.method}
            />
          )}
        </div>
      )}

      {tab === "schedules" && (
        <div role="tabpanel" aria-label="Schedules">
          <RecipeSchedulesPanel recipe={{ id: recipe.id, name: recipe.name }} />
        </div>
      )}
    </>
  );
}
