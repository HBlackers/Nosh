import { getRouteApi } from "@tanstack/react-router";
import { WeekNav } from "@/components/WeekNav";
import { Button } from "@/components/ui/button";
import { formatRange, resolveWeek, toISODate } from "@/lib/dates";
import { ShoppingList } from "../components/ShoppingList";
import { useShoppingList } from "../hooks/useShoppingList";

const route = getRouteApi("/shopping-list");

export function ShoppingListPage() {
  const { week } = route.useSearch();
  const { weekStart, weekEnd } = resolveWeek(week);
  const range = formatRange(weekStart, weekEnd);
  const { data, isPending, isError, refetch } = useShoppingList(toISODate(weekStart), toISODate(weekEnd));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Shopping list</h1>
          <p className="text-muted-foreground">{range}</p>
        </div>
        <WeekNav to="/shopping-list" weekStart={weekStart} />
      </div>

      {isPending && <p className="text-muted-foreground">Loading your list…</p>}

      {isError && (
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <p>We couldn't load your shopping list. Please try again.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {data && <ShoppingList list={data} title={`Shopping list, ${range}`} />}
    </div>
  );
}
