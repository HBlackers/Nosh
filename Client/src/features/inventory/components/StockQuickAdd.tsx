import { Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { ErrorList } from "@/components/ErrorList";
import { Button } from "@/components/ui/button";
import type { MeasurementUnit } from "@/lib/api/generated";
import { problemMessages } from "@/lib/problem";
import { roundAmount } from "@/lib/quantity";
import { useAddStock } from "../hooks/useAddStock";
import { QuantityFields, type UnitChoice, parseAmount, toChoice, toUnit } from "./QuantityFields";

type StockQuickAddProps = {
  ingredientId: string;
  ingredientName: string;
  suggested: { amount: number; unit: MeasurementUnit | null };
};

export function StockQuickAdd({ ingredientId, ingredientName, suggested }: StockQuickAddProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<UnitChoice>("none");
  const add = useAddStock();

  const amount = parseAmount(quantity);

  const show = () => {
    setQuantity(String(roundAmount(suggested.amount)));
    setUnit(toChoice(suggested.unit));
    add.reset();
    setOpen(true);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (amount !== null) {
      add.mutate({ ingredientId, quantity: amount, unit: toUnit(unit) }, { onSuccess: () => setOpen(false) });
    }
  };

  if (!open) {
    return (
      <Button type="button" variant="outline" size="lg" onClick={show} aria-label={`Add ${ingredientName} to stock`}>
        <Plus aria-hidden="true" />
        Add stock
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <QuantityFields label={ingredientName} quantity={quantity} unit={unit} onQuantityChange={setQuantity} onUnitChange={setUnit} />
      {add.isError && <ErrorList messages={problemMessages(add.error)} />}
      <div className="flex gap-2">
        <Button type="submit" size="lg" disabled={amount === null || add.isPending}>
          {add.isPending ? "Adding…" : "Add"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
