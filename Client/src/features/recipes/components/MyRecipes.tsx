import { getRouteApi } from "@tanstack/react-router";
import { useCallback } from "react";
import { FilterTabs } from "@/components/FilterTabs";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { DIETARY_REQUIREMENTS, humanize } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { useRecipes } from "../hooks/useRecipes";
import { CreateRecipeDialog } from "./CreateRecipeDialog";
import { RecipesTable } from "./RecipesTable";
import { StarterRecipes } from "./StarterRecipes";

const route = getRouteApi("/recipes");
const PAGE_SIZE = 20;
const dietaryOptions = DIETARY_REQUIREMENTS.map(value => ({ value, label: humanize(value) }));

export function MyRecipes() {
  const { q, page = 1, dietary = [] } = route.useSearch();
  const navigate = route.useNavigate();
  const { data, isPending, isError, isPlaceholderData, refetch } = useRecipes({ name: q, dietary, page, pageSize: PAGE_SIZE });

  const search = useCallback(
    (value: string) => void navigate({ search: previous => ({ ...previous, q: value || undefined, page: undefined }), replace: true }),
    [navigate],
  );

  if (isPending) {
    return <p className="text-muted-foreground">Loading your recipes…</p>;
  }

  if (isError) {
    return (
      <div className="space-y-3 rounded-xl border bg-card p-4">
        <p>We couldn't load your recipes. Please try again.</p>
        <Button variant="outline" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const isBlank = Number(data.totalCount) === 0 && !q && dietary.length === 0;
  if (isBlank) {
    return (
      <div className="space-y-8">
        <div className="space-y-3 rounded-xl border bg-card p-6">
          <p className="font-semibold">Your recipe book is empty</p>
          <p className="text-muted-foreground">Add a recipe of your own, or start with one of ours below.</p>
          <CreateRecipeDialog />
        </div>
        <StarterRecipes />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchInput value={q ?? ""} onSearch={search} label="Search recipes" placeholder="Search recipes" />

      <FilterTabs
        label="Dietary"
        options={dietaryOptions}
        selected={dietary}
        onChange={selected =>
          void navigate({ search: previous => ({ ...previous, dietary: selected.length > 0 ? selected : undefined, page: undefined }) })
        }
      />

      <div aria-busy={isPlaceholderData} className={cn("space-y-6", isPlaceholderData && "opacity-70 transition-opacity")}>
        {data.items.length === 0 ? <p className="text-muted-foreground">No recipes match your search.</p> : <RecipesTable recipes={data.items} />}
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          totalCount={Number(data.totalCount)}
          onPageChange={next => void navigate({ search: previous => ({ ...previous, page: next > 1 ? next : undefined }) })}
        />
      </div>
    </div>
  );
}
