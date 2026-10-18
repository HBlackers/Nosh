import { getRouteApi } from "@tanstack/react-router";
import { useCallback } from "react";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddStockDialog } from "../components/AddStockDialog";
import { InventoryTable } from "../components/InventoryTable";
import { useInventory } from "../hooks/useInventory";

const route = getRouteApi("/inventory");
const PAGE_SIZE = 20;

export function InventoryPage() {
  const { q, page = 1 } = route.useSearch();
  const navigate = route.useNavigate();
  const { data, isPending, isError, isPlaceholderData, refetch } = useInventory({ name: q, page, pageSize: PAGE_SIZE });

  const search = useCallback(
    (value: string) => void navigate({ search: previous => ({ ...previous, q: value || undefined, page: undefined }), replace: true }),
    [navigate],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Inventory</h1>
        <AddStockDialog />
      </div>

      <SearchInput value={q ?? ""} onSearch={search} label="Search your stock" placeholder="Search your stock" />

      {isPending && <p className="text-muted-foreground">Loading your stock…</p>}

      {isError && (
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <p>We couldn't load your stock. Please try again.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {data && (
        <div aria-busy={isPlaceholderData} className={cn("space-y-6", isPlaceholderData && "opacity-70 transition-opacity")}>
          {data.items.length === 0 ? (
            <p className="text-muted-foreground">{q ? "Nothing in stock matches your search." : "Nothing in stock yet. Add what's in your cupboards."}</p>
          ) : (
            <InventoryTable items={data.items} />
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
