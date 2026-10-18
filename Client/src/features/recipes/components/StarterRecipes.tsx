import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { ErrorList } from "@/components/ErrorList";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePreference } from "@/features/preferences";
import type { SampleRecipeResponse } from "@/lib/api/generated";
import { humanize } from "@/lib/enums";
import { problemMessages } from "@/lib/problem";
import { cn } from "@/lib/utils";
import { useImportSampleRecipe } from "../hooks/useImportSampleRecipe";
import { useSampleRecipes } from "../hooks/useSampleRecipes";

const PAGE_SIZE = 10;

export function StarterRecipes() {
  const [name, setName] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const preference = usePreference();
  const dietary = preference.data?.dietary ?? [];
  const { data, isPending, isError, isPlaceholderData, refetch } = useSampleRecipes(
    { name, dietary, page, pageSize: PAGE_SIZE },
    { enabled: preference.isSuccess },
  );

  return (
    <section aria-labelledby="starter-recipes" className="space-y-4">
      <div className="space-y-1">
        <h2 id="starter-recipes" className="text-xl">
          Starter recipes
        </h2>
        <p className="text-muted-foreground">
          {dietary.length > 0
            ? `Showing recipes that are ${dietary.map(requirement => humanize(requirement).toLowerCase()).join(" and ")}. You can change this under Preferences.`
            : "Showing all of our starter recipes. Set your dietary preferences to see just the ones that suit you."}
        </p>
      </div>

      <SearchInput
        value={name ?? ""}
        onSearch={value => {
          setName(value || undefined);
          setPage(1);
        }}
        label="Search starter recipes"
        placeholder="Search starter recipes"
      />

      {(isPending || preference.isPending) && <p className="text-muted-foreground">Loading starter recipes…</p>}

      {isError && (
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <p>We couldn't load the starter recipes. Please try again.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {data && (
        <div aria-busy={isPlaceholderData} className={cn("space-y-4", isPlaceholderData && "opacity-70 transition-opacity")}>
          {data.items.length === 0 ? (
            <p className="text-muted-foreground">No starter recipes match your search.</p>
          ) : (
            <ul className="space-y-3">
              {data.items.map(sample => (
                <StarterRecipe key={sample.slug} sample={sample} />
              ))}
            </ul>
          )}
          <Pagination page={page} pageSize={PAGE_SIZE} totalCount={Number(data.totalCount)} onPageChange={setPage} />
        </div>
      )}
    </section>
  );
}

function StarterRecipe({ sample }: { sample: SampleRecipeResponse }) {
  const add = useImportSampleRecipe();

  return (
    <li className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <h3 className="text-lg">{sample.name}</h3>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">{sample.cuisine}</Badge>
            {sample.mealTypes.map(meal => (
              <Badge key={meal} variant="outline">
                {meal}
              </Badge>
            ))}
            {sample.dietary.map(requirement => (
              <Badge key={requirement} variant="secondary">
                {humanize(requirement)}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Serves {sample.serves} · {sample.ingredients.length} ingredients
          </p>
        </div>

        <Button size="lg" variant={add.isSuccess ? "outline" : "default"} disabled={add.isPending || add.isSuccess} onClick={() => add.mutate(sample)}>
          {add.isSuccess ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
          {add.isPending ? "Adding…" : add.isSuccess ? "In your recipes" : "Add to my recipes"}
        </Button>
      </div>

      {add.isError && <ErrorList messages={problemMessages(add.error)} />}
    </li>
  );
}
