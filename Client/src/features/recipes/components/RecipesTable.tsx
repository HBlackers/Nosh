import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RecipeSummaryResponse } from "@/lib/api/generated";
import { humanize } from "@/lib/enums";

type RecipesTableProps = {
  recipes: RecipeSummaryResponse[];
  onView: (recipe: RecipeSummaryResponse) => void;
};

export function RecipesTable({ recipes, onView }: RecipesTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4">Name</TableHead>
            <TableHead className="hidden px-4 md:table-cell">Cuisine</TableHead>
            <TableHead className="px-4">Meals</TableHead>
            <TableHead className="px-4">Dietary</TableHead>
            <TableHead className="hidden px-4 text-right md:table-cell">Serves</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map(recipe => (
            <TableRow key={recipe.id} onClick={() => onView(recipe)} className="cursor-pointer">
              <TableCell className="whitespace-normal px-4 py-3 font-semibold">
                <button
                  type="button"
                  className="rounded-sm text-left outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {recipe.name}
                </button>
              </TableCell>
              <TableCell className="hidden px-4 py-3 md:table-cell">{recipe.cuisine}</TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {recipe.mealTypes.map(meal => (
                    <Badge key={meal} variant="outline">
                      {meal}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex flex-wrap gap-1.5">
                  {recipe.dietary.map(requirement => (
                    <Badge key={requirement} variant="secondary">
                      {humanize(requirement)}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="hidden px-4 py-3 text-right md:table-cell">{recipe.serves}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
