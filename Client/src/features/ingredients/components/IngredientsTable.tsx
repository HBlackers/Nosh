import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { IngredientResponse } from "@/lib/api/generated";

type IngredientsTableProps = {
  ingredients: IngredientResponse[];
};

export function IngredientsTable({ ingredients }: IngredientsTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map(ingredient => (
            <TableRow key={ingredient.id}>
              <TableCell className="px-4 py-3 font-semibold">{ingredient.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
