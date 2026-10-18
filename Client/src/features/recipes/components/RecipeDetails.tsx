import { Badge } from "@/components/ui/badge";
import type { DietaryRequirement, MealType, MeasurementUnit } from "@/lib/api/generated";
import { humanize } from "@/lib/enums";
import { formatQuantity } from "@/lib/quantity";

export type RecipeLine = {
  name: string;
  quantity: number | string | null;
  unit: MeasurementUnit | null;
  prep: string | null;
};

type RecipeDetailsProps = {
  cuisine: string;
  serves: number | string;
  mealTypes: MealType[];
  dietary: DietaryRequirement[];
  lines: RecipeLine[];
  method: string[];
};

export function RecipeDetails({ cuisine, serves, mealTypes, dietary, lines, method }: RecipeDetailsProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{cuisine}</Badge>
          {mealTypes.map(meal => (
            <Badge key={meal} variant="outline">
              {meal}
            </Badge>
          ))}
          {dietary.map(requirement => (
            <Badge key={requirement} variant="secondary">
              {humanize(requirement)}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground">Serves {serves}</p>
      </div>

      <section aria-labelledby="recipe-ingredients" className="space-y-2">
        <h3 id="recipe-ingredients" className="text-lg">
          Ingredients
        </h3>
        <ul className="divide-y rounded-lg border">
          {lines.map((line, index) => (
            <li key={`${line.name}-${index}`} className="flex items-start justify-between gap-3 px-3 py-2.5">
              <div className="min-w-0">
                <p className="font-semibold">{line.name}</p>
                {line.prep && <p className="text-base text-muted-foreground">{line.prep}</p>}
              </div>
              <p className="shrink-0">{line.quantity === null ? "To taste" : formatQuantity(line.quantity, line.unit)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="recipe-method" className="space-y-2">
        <h3 id="recipe-method" className="text-lg">
          Method
        </h3>
        <ol className="list-decimal space-y-2 pl-5">
          {method.map(step => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
