import { Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ShoppingItem } from "../types";
import { ShoppingListItem } from "./ShoppingListItem";

type ShoppingListProps = {
  items: ShoppingItem[];
  title: string;
};

export function ShoppingList({ items, title }: ShoppingListProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) =>
    setChecked(previous => {
      const next = new Set(previous);
      if (!next.delete(id)) {
        next.add(id);
      }
      return next;
    });

  const ordered = [...items.filter(item => !checked.has(item.id)), ...items.filter(item => checked.has(item.id))];
  const progress = items.length === 0 ? 0 : Math.round((checked.size / items.length) * 100);

  const copy = async () => {
    const lines = items.map(item => `- ${item.name}: ${item.quantity}`);
    await navigator.clipboard.writeText([title, ...lines].join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="space-y-3 rounded-xl border bg-card p-6">
        <p className="font-semibold">Nothing planned this week</p>
        <p className="text-muted-foreground">Plan a recipe on your calendar and its ingredients will show up here.</p>
        <Button asChild variant="outline" size="lg">
          <Link to="/">Go to calendar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div
          role="progressbar"
          aria-label="Items got"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={checked.size}
          className="h-2 min-w-32 flex-1 overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-muted-foreground">
          {checked.size} of {items.length} got
        </p>
        <Button variant="outline" size="lg" onClick={() => void copy()}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Copied" : "Copy list"}
        </Button>
      </div>

      <ul className="overflow-hidden rounded-xl border bg-card">
        {ordered.map(item => (
          <ShoppingListItem key={item.id} item={item} checked={checked.has(item.id)} onToggle={() => toggle(item.id)} />
        ))}
      </ul>
    </div>
  );
}
