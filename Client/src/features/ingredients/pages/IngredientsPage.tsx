import { getRouteApi } from "@tanstack/react-router";
import { useCallback } from "react";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateIngredientDialog } from "../components/CreateIngredientDialog";
import { IngredientsTable } from "../components/IngredientsTable";
import { useIngredients } from "../hooks/useIngredients";

const route = getRouteApi("/ingredients");
const PAGE_SIZE = 20;

export function IngredientsPage() {
  const { q, page = 1 } = route.useSearch();
  const navigate = route.useNavigate();
  const { data, isPending, isError, isPlaceholderData, refetch } = useIngredients({ name: q, page, pageSize: PAGE_SIZE });

  const search = useCallback(
    (value: string) => void navigate({ search: previous => ({ ...previous, q: value || undefined, page: undefined }), replace: true }),
    [navigate],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Ingredients</h1>
        <CreateIngredientDialog />
      </div>

      <SearchInput value={q ?? ""} onSearch={search} label="Search ingredients" placeholder="Search ingredients" />

      {isPending && <p className="text-muted-foreground">Loading your ingredients…</p>}

      {isError && (
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <p>We couldn't load your ingredients. Please try again.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {data && (
        <div aria-busy={isPlaceholderData} className={cn("space-y-6", isPlaceholderData && "opacity-70 transition-opacity")}>
          {data.items.length === 0 ? (
            <p className="text-muted-foreground">No ingredients match your search.</p>
          ) : (
            <IngredientsTable ingredients={data.items} />
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
