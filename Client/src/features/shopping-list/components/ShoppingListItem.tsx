import { Link } from "@tanstack/react-router";
import { Check, TriangleAlert } from "lucide-react";
import { useAddStock } from "@/features/inventory";
import type { ShoppingListItemResponse } from "@/lib/api/generated";
import { formatQuantity } from "@/lib/quantity";
import { cn } from "@/lib/utils";

function detail(item: ShoppingListItemResponse): string | null {
  const needed = item.needed ? formatQuantity(item.needed.amount, item.needed.unit) : null;
  const stock = item.inStock ? formatQuantity(item.inStock.quantity, item.inStock.unit) : null;
  if (item.status === "UnitMismatch") {
    return `You have ${stock}, which we can't compare with ${needed}.`;
  }
  if (needed && stock) {
    return `Need ${needed}, have ${stock}`;
  }
  return needed ? `Need ${needed}` : null;
}

export function ShoppingListItem({ item, reading = false }: { item: ShoppingListItemResponse; reading?: boolean }) {
  const add = useAddStock();
  const covered = item.status === "Covered";
  const mismatch = item.status === "UnitMismatch";
  const note = detail(item);

  const got = () =>
    add.mutate({ ingredientId: item.ingredientId, quantity: item.toBuy ? Number(item.toBuy.amount) : 1, unit: item.toBuy?.unit ?? null });

  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className={cn("block font-semibold", covered && "text-muted-foreground")}>{item.ingredientName}</span>
        <span className="block text-base text-muted-foreground">For {item.recipes.map(recipe => recipe.name).join(", ")}</span>
        {note && <span className="block text-base text-muted-foreground">{note}</span>}
        {add.isError && (
          <span role="alert" className="block text-base">
            We couldn't add that to your stock. Please try again.
          </span>
        )}
      </span>
      <span className={cn("shrink-0 text-right", covered && "text-muted-foreground")}>
        {covered ? "Covered" : item.toBuy ? formatQuantity(item.toBuy.amount, item.toBuy.unit) : "Some"}
      </span>
    </>
  );

  if (mismatch) {
    return (
      <li aria-current={reading ? "true" : undefined} className={cn("flex min-h-14 items-center gap-4 border-t px-4 py-3 first:border-t-0", reading && "bg-accent")}>
        <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center">
          <TriangleAlert className="size-5" />
        </span>
        {body}
        <Link to="/inventory" search={{ q: item.ingredientName }} className="shrink-0 text-teal-ink underline dark:text-primary">
          Fix stock
        </Link>
      </li>
    );
  }

  return (
    <li aria-current={reading ? "true" : undefined} className={cn("border-t first:border-t-0", reading && "bg-accent")}>
      <label className={cn("flex min-h-14 items-center gap-4 px-4 py-3", !covered && "cursor-pointer")}>
        <input type="checkbox" checked={covered} disabled={covered || add.isPending} onChange={got} className="peer sr-only" />
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-md border-2 border-input bg-card text-primary-foreground peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
        >
          <Check className="size-5" />
        </span>
        {body}
      </label>
    </li>
  );
}
