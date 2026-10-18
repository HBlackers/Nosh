import { Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { ErrorList } from "@/components/ErrorList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { IngredientCombobox, type IngredientOption } from "@/features/ingredients";
import { problemMessages } from "@/lib/problem";
import { useAddStock } from "../hooks/useAddStock";
import { QuantityFields, type UnitChoice, parseAmount, toUnit } from "./QuantityFields";

export function AddStockDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus aria-hidden="true" />
          Add stock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <AddStockForm onAdded={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function AddStockForm({ onAdded }: { onAdded: () => void }) {
  const [ingredient, setIngredient] = useState<IngredientOption | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<UnitChoice>("none");
  const add = useAddStock();

  const amount = parseAmount(quantity);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (ingredient && amount !== null) {
      add.mutate({ ingredientId: ingredient.id, quantity: amount, unit: toUnit(unit) }, { onSuccess: onAdded });
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Add stock</DialogTitle>
        <DialogDescription>Add what you've got. If it's already in stock, we'll add it to what you have.</DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Label>Ingredient</Label>
        <IngredientCombobox value={ingredient} onChange={setIngredient} label="Ingredient" />
      </div>

      <div className="space-y-2">
        <Label>How much</Label>
        <QuantityFields label="Stock" quantity={quantity} unit={unit} onQuantityChange={setQuantity} onUnitChange={setUnit} />
      </div>

      {add.isError && <ErrorList messages={problemMessages(add.error)} />}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" size="lg" disabled={!ingredient || amount === null || add.isPending}>
          {add.isPending ? "Adding…" : "Add stock"}
        </Button>
      </DialogFooter>
    </form>
  );
}
