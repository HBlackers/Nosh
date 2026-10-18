import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShoppingItem } from "../types";

type ShoppingListItemProps = {
  item: ShoppingItem;
  checked: boolean;
  onToggle: () => void;
};

export function ShoppingListItem({ item, checked, onToggle }: ShoppingListItemProps) {
  return (
    <li className="border-t first:border-t-0">
      <label className="flex min-h-14 cursor-pointer items-center gap-4 px-4 py-3">
        <input type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-md border-2 border-input bg-card text-primary-foreground peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
        >
          <Check className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block font-semibold", checked && "text-muted-foreground line-through")}>{item.name}</span>
          <span className="block text-sm text-muted-foreground">For {item.recipes.join(", ")}</span>
        </span>
        <span className={cn("shrink-0 text-right", checked && "text-muted-foreground")}>{item.quantity}</span>
      </label>
    </li>
  );
}
