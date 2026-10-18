import { getRouteApi } from "@tanstack/react-router";
import { WeekNav } from "@/components/WeekNav";
import { formatRange, resolveWeek } from "@/lib/dates";
import { ShoppingList } from "../components/ShoppingList";

const route = getRouteApi("/shopping-list");

export function ShoppingListPage() {
  const { week } = route.useSearch();
  const { weekStart, weekEnd } = resolveWeek(week);
  const range = formatRange(weekStart, weekEnd);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Shopping list</h1>
          <p className="text-muted-foreground">{range}</p>
        </div>
        <WeekNav to="/shopping-list" weekStart={weekStart} />
      </div>

      <ShoppingList items={[]} title={`Shopping list, ${range}`} />
    </div>
  );
}
