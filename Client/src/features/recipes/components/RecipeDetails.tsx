import { ReadAloudControls, ReadFromHereButton, useReadAloud } from "@/features/accessibility";
import { Badge } from "@/components/ui/badge";
import type { DietaryRequirement, MealType, MeasurementUnit } from "@/lib/api/generated";
import { humanize } from "@/lib/enums";
import { formatQuantity, spokenQuantity } from "@/lib/quantity";
import { cn } from "@/lib/utils";

export type RecipeLine = {
  name: string;
  quantity: number | string | null;
  unit: MeasurementUnit | null;
  prep: string | null;
};

type RecipeDetailsProps = {
  title: string;
  // Names what is being read, so only this recipe shows as playing.
  speechId: string;
  cuisine: string;
  serves: number | string;
  mealTypes: MealType[];
  dietary: DietaryRequirement[];
  lines: RecipeLine[];
  method: string[];
};

// What is read, one line at a time: the heading, the ingredients, then each step. The line numbers let the page highlight the one being spoken.
function speechFor({ title, serves, lines, method }: Pick<RecipeDetailsProps, "title" | "serves" | "lines" | "method">) {
  const ingredientStart = 2;
  const methodStart = ingredientStart + lines.length;
  return {
    ingredientStart,
    stepStart: methodStart + 1,
    lines: [
      `${title}. Serves ${serves}.`,
      "Ingredients.",
      ...lines.map(line => {
        const amount = line.quantity === null ? "Some" : spokenQuantity(line.quantity, line.unit);
        return `${amount} ${line.quantity !== null && line.unit ? "of " : ""}${line.name}${line.prep ? `, ${line.prep}` : ""}.`;
      }),
      "Method.",
      ...method.map((step, index) => `Step ${index + 1}. ${step}`),
    ],
  };
}

const active = "bg-accent";

export function RecipeDetails({ title, speechId, cuisine, serves, mealTypes, dietary, lines, method }: RecipeDetailsProps) {
  const speech = speechFor({ title, serves, lines, method });
  const { index } = useReadAloud(speechId);

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
        <ReadAloudControls owner={speechId} lines={speech.lines} label="Read recipe aloud" />
      </div>

      <section aria-labelledby="recipe-ingredients" className="space-y-2">
        <h3 id="recipe-ingredients" className="text-lg">
          Ingredients
        </h3>
        <ul className="divide-y rounded-lg border">
          {lines.map((line, position) => (
            <li
              key={`${line.name}-${position}`}
              aria-current={index === speech.ingredientStart + position ? "true" : undefined}
              className={cn("flex items-start justify-between gap-3 px-3 py-2.5", index === speech.ingredientStart + position && active)}
            >
              <div className="min-w-0">
                <p className="font-semibold">{line.name}</p>
                {line.prep && <p className="text-muted-foreground">{line.prep}</p>}
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
        <ol className="space-y-2">
          {method.map((step, position) => (
            <li
              key={step}
              aria-current={index === speech.stepStart + position ? "true" : undefined}
              className={cn("flex items-start justify-between gap-3 rounded-lg px-3 py-2", index === speech.stepStart + position && active)}
            >
              <p>
                <span className="font-semibold">{position + 1}. </span>
                {step}
              </p>
              <ReadFromHereButton owner={speechId} lines={speech.lines} from={speech.stepStart + position} label={`Read aloud from step ${position + 1}`} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
