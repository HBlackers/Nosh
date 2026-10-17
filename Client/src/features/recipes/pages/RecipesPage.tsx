import { getRouteApi } from "@tanstack/react-router";
import { useCallback } from "react";
import { FilterTabs } from "@/components/FilterTabs";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DIETARY_REQUIREMENTS, humanize } from "@/lib/enums";
import { CreateRecipeDialog } from "../components/CreateRecipeDialog";
import { RecipesTable } from "../components/RecipesTable";
import { useRecipes } from "../hooks/useRecipes";

const route = getRouteApi("/recipes");
const PAGE_SIZE = 20;
const dietaryOptions = DIETARY_REQUIREMENTS.map(value => ({ value, label: humanize(value) }));

export function RecipesPage() {
  const { q, page = 1, dietary = [] } = route.useSearch();
  const navigate = route.useNavigate();
  const { data, isPending, isError, isPlaceholderData, refetch } = useRecipes({ name: q, dietary, page, pageSize: PAGE_SIZE });

  const search = useCallback(
    (value: string) => void navigate({ search: previous => ({ ...previous, q: value || undefined, page: undefined }), replace: true }),
    [navigate],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Recipes</h1>
        <CreateRecipeDialog />
      </div>

      <SearchInput value={q ?? ""} onSearch={search} label="Search recipes" placeholder="Search recipes" />

      <FilterTabs
        label="Dietary"
        options={dietaryOptions}
        selected={dietary}
        onChange={selected =>
          void navigate({ search: previous => ({ ...previous, dietary: selected.length > 0 ? selected : undefined, page: undefined }) })
        }
      />

      {isPending && <p className="text-muted-foreground">Loading your recipes…</p>}

      {isError && (
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <p>We couldn't load your recipes. Please try again.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {data && (
        <div aria-busy={isPlaceholderData} className={cn("space-y-6", isPlaceholderData && "opacity-70 transition-opacity")}>
          {data.items.length === 0 ? (
            <p className="text-muted-foreground">No recipes match your search.</p>
          ) : (
            <RecipesTable recipes={data.items} />
          )}
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalCount={Number(data.totalCount)}
            onPageChange={next => void navigate({ search: previous => ({ ...previous, page: next > 1 ? next : undefined }) })}
          />
        </div>
      )}
    </div>
  );
}
