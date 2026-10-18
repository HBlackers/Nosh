import { Check, Plus } from "lucide-react";
import { ErrorList } from "@/components/ErrorList";
import { Button } from "@/components/ui/button";
import type { SampleRecipeResponse } from "@/lib/api/generated";
import { problemMessages } from "@/lib/problem";
import { useImportSampleRecipe } from "../hooks/useImportSampleRecipe";

export function AddSampleButton({ sample }: { sample: SampleRecipeResponse }) {
  const add = useImportSampleRecipe();

  return (
    <div className="space-y-2">
      <Button size="lg" variant={add.isSuccess ? "outline" : "default"} disabled={add.isPending || add.isSuccess} onClick={() => add.mutate(sample)}>
        {add.isSuccess ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
        {add.isPending ? "Adding…" : add.isSuccess ? "In your recipes" : "Add to my recipes"}
      </Button>
      {add.isError && <ErrorList messages={problemMessages(add.error)} />}
    </div>
  );
}
