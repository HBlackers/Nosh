import { getRouteApi } from "@tanstack/react-router";
import { useCallback } from "react";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDietaryFilter } from "../hooks/useDietaryFilter";
import { useRecipes } from "../hooks/useRecipes";
import { CreateRecipeDialog } from "./CreateRecipeDialog";
import { DietaryFilter } from "./DietaryFilter";
import { RecipesTable } from "./RecipesTable";
import { StarterRecipes } from "./StarterRecipes";

const route = getRouteApi("/recipes");
const PAGE_SIZE = 20;

export function MyRecipes() {
  const { q, page = 1 } = route.useSearch();
  const navigate = route.useNavigate();
  const { selected: dietary, select, ready } = useDietaryFilter();
  const { data, isPending, isError, isPlaceholderData, refetch } = useRecipes({ name: q, dietary, page, pageSize: PAGE_SIZE }, { enabled: ready });
  const everything = useRecipes({ page: 1, pageSize: 1 });

  const search = useCallback(
    (value: string) => void navigate({ search: previous => ({ ...previous, q: value || undefined, page: undefined }), replace: true }),
    [navigate],
  );

  if (isPending || everything.isPending) {
    return <p className="text-muted-foreground">Loading your recipes…</p>;
  }

  if (isError || everything.isError) {
    return (
      <div className="space-y-3 rounded-xl border bg-card p-4">
        <p>We couldn't load your recipes. Please try again.</p>
        <Button variant="outline" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (Number(everything.data.totalCount) === 0) {
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

      <DietaryFilter selected={dietary} onChange={select} />

      <div aria-busy={isPlaceholderData} className={cn("space-y-6", isPlaceholderData && "opacity-70 transition-opacity")}>
        {data.items.length === 0 ? (
          <p className="text-muted-foreground">No recipes match. Try a different search, or change the dietary tags.</p>
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
    </div>
  );
}
