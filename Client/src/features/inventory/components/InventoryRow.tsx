import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ErrorList } from "@/components/ErrorList";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { InventoryItemResponse } from "@/lib/api/generated";
import { problemMessages } from "@/lib/problem";
import { formatQuantity, roundAmount, toNumber } from "@/lib/quantity";
import { useDeleteStock } from "../hooks/useDeleteStock";
import { useUpdateStock } from "../hooks/useUpdateStock";
import { QuantityFields, type UnitChoice, parseAmount, toChoice, toUnit } from "./QuantityFields";

export function InventoryRow({ item }: { item: InventoryItemResponse }) {
  const [editing, setEditing] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<UnitChoice>("none");
  const update = useUpdateStock();
  const remove = useDeleteStock();

  const amount = parseAmount(quantity);
  const error = update.isError ? update.error : remove.isError ? remove.error : null;

  const startEditing = () => {
    setQuantity(String(roundAmount(toNumber(item.quantity))));
    setUnit(toChoice(item.unit));
    update.reset();
    setEditing(true);
  };

  const save = () => {
    if (amount !== null) {
      update.mutate({ id: item.id, body: { quantity: amount, unit: toUnit(unit) } }, { onSuccess: () => setEditing(false) });
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="px-4 py-3 font-semibold">{item.ingredientName}</TableCell>
        <TableCell className="px-4 py-3">
          {editing ? (
            <QuantityFields label={item.ingredientName} quantity={quantity} unit={unit} onQuantityChange={setQuantity} onUnitChange={setUnit} />
          ) : (
            formatQuantity(item.quantity, item.unit)
          )}
        </TableCell>
        <TableCell className="px-4 py-3">
          <div className="flex flex-wrap justify-end gap-2">
            {editing ? (
              <>
                <Button size="lg" onClick={save} disabled={amount === null || update.isPending}>
                  {update.isPending ? "Saving…" : "Save"}
                </Button>
                <Button variant="outline" size="lg" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="lg" onClick={startEditing} aria-label={`Edit ${item.ingredientName}`}>
                  <Pencil aria-hidden="true" />
                  Edit
                </Button>
                <Button variant="outline" size="lg" onClick={() => remove.mutate(item.id)} disabled={remove.isPending} aria-label={`${item.ingredientName} used up`}>
                  <Trash2 aria-hidden="true" />
                  Used up
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
      {error && (
        <TableRow>
          <TableCell colSpan={3} className="px-4 pb-3">
            <ErrorList messages={problemMessages(error)} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
