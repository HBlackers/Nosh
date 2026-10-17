import { ShoppingBasket } from "lucide-react";

export function ShoppingListPanel() {
  return (
    <section aria-labelledby="shopping-list-heading" className="space-y-3">
      <h2 id="shopping-list-heading" className="flex items-center gap-2 text-xl">
        <ShoppingBasket className="size-5" aria-hidden="true" />
        Shopping list
      </h2>
      <p className="text-muted-foreground">Nothing here yet. Your shopping list will be built from the recipes you plan.</p>
    </section>
  );
}
