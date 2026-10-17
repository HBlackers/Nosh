import { Plus, Trash2 } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import { ErrorList } from "@/components/ErrorList";
import { FilterTabs } from "@/components/FilterTabs";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Cuisine, DietaryRequirement, MealType, MeasurementUnit, RecipeTag } from "@/lib/api/generated";
import { CUISINES, DIETARY_REQUIREMENTS, MEAL_TYPES, MEASUREMENT_UNITS, RECIPE_TAGS, humanize } from "@/lib/enums";
import { problemMessages } from "@/lib/problem";
import { IngredientCombobox, type IngredientOption } from "@/features/ingredients";
import { useCreateRecipe } from "../hooks/useCreateRecipe";

type Step = { key: number; text: string };
type Line = { key: number; ingredient: IngredientOption | null; quantity: string; unit: MeasurementUnit | "none"; prep: string };

const toOptions = <T extends string>(values: T[]) => values.map(value => ({ value, label: humanize(value) }));
const mealOptions = toOptions(MEAL_TYPES);
const dietaryOptions = toOptions(DIETARY_REQUIREMENTS);
const tagOptions = toOptions(RECIPE_TAGS);

export function RecipeForm({ onCreated }: { onCreated: () => void }) {
  const nextKey = useRef(2);
  const [name, setName] = useState("");
  const [serves, setServes] = useState("2");
  const [cuisine, setCuisine] = useState<Cuisine | "">("");
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [dietary, setDietary] = useState<DietaryRequirement[]>([]);
  const [tags, setTags] = useState<RecipeTag[]>([]);
  const [steps, setSteps] = useState<Step[]>([{ key: 0, text: "" }]);
  const [lines, setLines] = useState<Line[]>([{ key: 1, ingredient: null, quantity: "", unit: "none", prep: "" }]);
  const create = useCreateRecipe();

  const updateStep = (key: number, text: string) => setSteps(steps.map(step => (step.key === key ? { ...step, text } : step)));
  const updateLine = (key: number, change: Partial<Line>) => setLines(lines.map(line => (line.key === key ? { ...line, ...change } : line)));

  const canSubmit =
    name.trim() !== "" &&
    Number(serves) >= 1 &&
    cuisine !== "" &&
    mealTypes.length > 0 &&
    steps.some(step => step.text.trim() !== "") &&
    lines.length > 0 &&
    lines.every(line => line.ingredient !== null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (cuisine === "") {
      return;
    }
    create.mutate(
      {
        name: name.trim(),
        serves: Number(serves),
        cuisine,
        mealTypes,
        dietary,
        tags,
        method: steps.map(step => step.text.trim()).filter(text => text !== ""),
        ingredients: lines.flatMap(line =>
          line.ingredient
            ? [
                {
                  id: null,
                  ingredientId: line.ingredient.id,
                  quantity: line.quantity.trim() === "" ? null : Number(line.quantity),
                  unit: line.unit === "none" ? null : line.unit,
                  prep: line.prep.trim() === "" ? null : line.prep.trim(),
                },
              ]
            : [],
        ),
      },
      { onSuccess: onCreated },
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle>New recipe</DialogTitle>
        <DialogDescription>Add a recipe you can plan on your calendar.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 sm:grid-cols-[1fr_6rem]">
        <div className="space-y-2">
          <Label htmlFor="recipe-name">Name</Label>
          <Input id="recipe-name" value={name} onChange={event => setName(event.target.value)} maxLength={200} autoComplete="off" className="h-10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipe-serves">Serves</Label>
          <Input id="recipe-serves" type="number" min={1} value={serves} onChange={event => setServes(event.target.value)} className="h-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipe-cuisine">Cuisine</Label>
        <Select value={cuisine} onValueChange={value => setCuisine(value as Cuisine)}>
          <SelectTrigger id="recipe-cuisine" className="h-10 w-full">
            <SelectValue placeholder="Choose a cuisine" />
          </SelectTrigger>
          <SelectContent>
            {CUISINES.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FilterTabs label="Meals" options={mealOptions} selected={mealTypes} onChange={setMealTypes} showAll={false} />
      <FilterTabs label="Dietary" options={dietaryOptions} selected={dietary} onChange={setDietary} showAll={false} />
      <FilterTabs label="Tags" options={tagOptions} selected={tags} onChange={setTags} showAll={false} />

      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-semibold text-muted-foreground">Ingredients</legend>
        <ul className="space-y-3">
          {lines.map((line, index) => (
            <li key={line.key} className="space-y-2 rounded-lg border p-3">
              <IngredientCombobox
                label={`Ingredient ${index + 1}`}
                value={line.ingredient}
                onChange={ingredient => updateLine(line.key, { ingredient })}
              />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-[6rem_9rem_1fr]">
                <Input
                  aria-label={`Quantity ${index + 1}`}
                  placeholder="Quantity"
                  inputMode="decimal"
                  value={line.quantity}
                  onChange={event => updateLine(line.key, { quantity: event.target.value })}
                  className="h-10"
                />
                <Select value={line.unit} onValueChange={value => updateLine(line.key, { unit: value as Line["unit"] })}>
                  <SelectTrigger aria-label={`Unit ${index + 1}`} className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No unit</SelectItem>
                    {MEASUREMENT_UNITS.map(unit => (
                      <SelectItem key={unit} value={unit}>
                        {humanize(unit)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  aria-label={`Preparation ${index + 1}`}
                  placeholder="Preparation, e.g. chopped"
                  value={line.prep}
                  onChange={event => updateLine(line.key, { prep: event.target.value })}
                  maxLength={200}
                  className="col-span-2 h-10 sm:col-span-1"
                />
              </div>
              {lines.length > 1 && (
                <Button type="button" variant="ghost" onClick={() => setLines(lines.filter(item => item.key !== line.key))}>
                  <Trash2 aria-hidden="true" />
                  Remove ingredient {index + 1}
                </Button>
              )}
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          onClick={() => setLines([...lines, { key: nextKey.current++, ingredient: null, quantity: "", unit: "none", prep: "" }])}
        >
          <Plus aria-hidden="true" />
          Add ingredient
        </Button>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-semibold text-muted-foreground">Method</legend>
        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li key={step.key} className="flex gap-2">
              <Textarea
                aria-label={`Step ${index + 1}`}
                placeholder={`Step ${index + 1}`}
                value={step.text}
                onChange={event => updateStep(step.key, event.target.value)}
              />
              {steps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove step ${index + 1}`}
                  className="size-10 shrink-0"
                  onClick={() => setSteps(steps.filter(item => item.key !== step.key))}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              )}
            </li>
          ))}
        </ol>
        <Button type="button" variant="outline" onClick={() => setSteps([...steps, { key: nextKey.current++, text: "" }])}>
          <Plus aria-hidden="true" />
          Add step
        </Button>
      </fieldset>

      {create.isError && <ErrorList messages={problemMessages(create.error)} />}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" size="lg" disabled={!canSubmit || create.isPending}>
          {create.isPending ? "Adding…" : "Add recipe"}
        </Button>
      </DialogFooter>
    </form>
  );
}
