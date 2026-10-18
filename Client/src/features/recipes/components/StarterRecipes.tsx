import { useState } from "react";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SampleRecipeResponse } from "@/lib/api/generated";
import { humanize } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { useDietaryFilter } from "../hooks/useDietaryFilter";
import { useSampleRecipes } from "../hooks/useSampleRecipes";
import { AddSampleButton } from "./AddSampleButton";
import { DietaryFilter } from "./DietaryFilter";
import { SampleRecipeDialog } from "./SampleRecipeDialog";

const PAGE_SIZE = 10;

export function StarterRecipes() {
  const [name, setName] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<SampleRecipeResponse | null>(null);
  const { selected: dietary, select, ready } = useDietaryFilter();
  const { data, isPending, isError, isPlaceholderData, refetch } = useSampleRecipes({ name, dietary, page, pageSize: PAGE_SIZE }, { enabled: ready });

  return (
    <section aria-labelledby="starter-recipes" className="space-y-4">
      <div className="space-y-1">
        <h2 id="starter-recipes" className="text-xl">
          Starter recipes
        </h2>
        <p className="text-muted-foreground">Ready-made recipes you can add to your own. We start with ones that suit your dietary preferences; use the tags to change that.</p>
      </div>

      <DietaryFilter
        selected={dietary}
        onChange={selected => {
          select(selected);
          setPage(1);
        }}
      />

      <SearchInput
        value={name ?? ""}
        onSearch={value => {
          setName(value || undefined);
          setPage(1);
        }}
        label="Search starter recipes"
        placeholder="Search starter recipes"
      />

      {isPending && <p className="text-muted-foreground">Loading starter recipes…</p>}

      {isError && (
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <p>We couldn't load the starter recipes. Please try again.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {data && (
        <div aria-busy={isPlaceholderData} className={cn("space-y-4", isPlaceholderData && "opacity-90 transition-opacity")}>
          {data.items.length === 0 ? (
            <p className="text-muted-foreground">No starter recipes match your search.</p>
          ) : (
            <ul className="space-y-3">
              {data.items.map(sample => (
                <StarterRecipe key={sample.slug} sample={sample} onView={() => setViewing(sample)} />
              ))}
            </ul>
          )}
          <Pagination page={page} pageSize={PAGE_SIZE} totalCount={Number(data.totalCount)} onPageChange={setPage} />
        </div>
      )}

      <SampleRecipeDialog sample={viewing} onClose={() => setViewing(null)} />
    </section>
  );
}

function StarterRecipe({ sample, onView }: { sample: SampleRecipeResponse; onView: () => void }) {
  return (
    <li onClick={onView} className="cursor-pointer space-y-3 rounded-xl border bg-card p-4 hover:bg-accent">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <h3 className="text-lg">
            <button
              type="button"
              className="rounded-sm text-left outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring"
            >
              {sample.name}
            </button>
          </h3>
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
          <p className="text-base text-muted-foreground">
            Serves {sample.serves} · {sample.ingredients.length} ingredients
          </p>
        </div>

        <div onClick={event => event.stopPropagation()}>
          <AddSampleButton sample={sample} />
        </div>
      </div>
    </li>
  );
}
