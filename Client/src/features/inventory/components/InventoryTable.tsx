import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InventoryItemResponse } from "@/lib/api/generated";
import { InventoryRow } from "./InventoryRow";

export function InventoryTable({ items }: { items: InventoryItemResponse[] }) {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4">Ingredient</TableHead>
            <TableHead className="px-4">In stock</TableHead>
            <TableHead className="px-4">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <InventoryRow key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
