import type { Cuisine, DietaryRequirement, MealType, MeasurementUnit, RecipeTag } from "@/lib/api/generated";

export const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Dessert"];

export const CUISINES: Cuisine[] = ["British", "Mediterranean", "Indian", "Italian", "Mexican", "Chinese", "Thai"];

export const RECIPE_TAGS: RecipeTag[] = ["Quick", "BatchCook", "FreezerFriendly", "KidFriendly"];

export const MEASUREMENT_UNITS: MeasurementUnit[] = [
  "Gram",
  "Millilitre",
  "Tablespoon",
  "Teaspoon",
  "Tin",
  "Clove",
  "Slice",
  "Thumb",
  "Handful",
  "Rasher",
  "Ball",
];

export const DIETARY_REQUIREMENTS: DietaryRequirement[] = ["Vegetarian", "Vegan", "GlutenFree", "DairyFree"];

export function humanize(value: string): string {
  const spaced = value.replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced.charAt(0) + spaced.slice(1).toLowerCase();
}
