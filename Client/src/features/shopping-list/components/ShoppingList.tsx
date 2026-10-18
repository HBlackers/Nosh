import { Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ShoppingListResponse } from "@/lib/api/generated";
import { formatQuantity } from "@/lib/quantity";
import { ShoppingListItem } from "./ShoppingListItem";

type ShoppingListProps = {
  list: ShoppingListResponse;
  title: string;
};

export function ShoppingList({ list, title }: ShoppingListProps) {
  const [copied, setCopied] = useState(false);

  const { items, unplannedStock } = list;
  const covered = items.filter(item => item.status === "Covered");
  const toBuy = items.filter(item => item.status !== "Covered");
  const progress = items.length === 0 ? 0 : Math.round((covered.length / items.length) * 100);

  const copy = async () => {
    const lines = toBuy.map(item => (item.toBuy ? `- ${item.ingredientName}: ${formatQuantity(item.toBuy.amount, item.toBuy.unit)}` : `- ${item.ingredientName}`));
    await navigator.clipboard.writeText([title, ...lines].join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="space-y-3 rounded-xl border bg-card p-6">
        <p className="font-semibold">Nothing to shop for this week</p>
        <p className="text-muted-foreground">Plan a recipe on your calendar and its ingredients will show up here.</p>
        <Button asChild variant="outline" size="lg">
          <Link to="/">Go to calendar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div
          role="progressbar"
          aria-label="Items covered"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={covered.length}
          className="h-2 min-w-32 flex-1 overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-muted-foreground">
          {covered.length} of {items.length} covered
        </p>
        <Button variant="outline" size="lg" onClick={() => void copy()} disabled={toBuy.length === 0}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Copied" : "Copy list"}
        </Button>
      </div>

      {toBuy.length > 0 && (
        <section aria-labelledby="to-buy" className="space-y-2">
          <h2 id="to-buy" className="text-xl">
            To buy
          </h2>
          <ul className="overflow-hidden rounded-xl border bg-card">
            {toBuy.map(item => (
              <ShoppingListItem key={`${item.ingredientId}-${item.needed?.unit ?? "none"}`} item={item} />
            ))}
          </ul>
        </section>
      )}

      {covered.length > 0 && (
        <section aria-labelledby="covered" className="space-y-2">
          <h2 id="covered" className="text-xl">
            Covered
          </h2>
          <ul className="overflow-hidden rounded-xl border bg-card">
            {covered.map(item => (
              <ShoppingListItem key={`${item.ingredientId}-${item.needed?.unit ?? "none"}`} item={item} />
            ))}
          </ul>
        </section>
      )}

      {unplannedStock.length > 0 && (
        <section aria-labelledby="not-planned" className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="not-planned" className="text-xl">
              In stock, not planned
            </h2>
            <Button asChild variant="outline" size="lg">
              <Link to="/inventory">Manage stock</Link>
            </Button>
          </div>
          <ul className="overflow-hidden rounded-xl border bg-card">
            {unplannedStock.map(stock => (
              <li key={stock.id} className="flex min-h-12 items-center justify-between gap-4 border-t px-4 py-3 first:border-t-0">
                <span className="font-semibold">{stock.ingredientName}</span>
                <span className="text-muted-foreground">{formatQuantity(stock.quantity, stock.unit)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
