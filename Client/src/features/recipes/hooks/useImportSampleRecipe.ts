import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ensureIngredient, ingredientKeys } from "@/features/ingredients";
import type { SampleRecipeResponse } from "@/lib/api/generated";
import { createRecipe, recipeKeys } from "../api/recipes.queries";

export const useImportSampleRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sample: SampleRecipeResponse) => {
      const ingredients = [];
      for (const line of sample.ingredients) {
        const ingredient = await ensureIngredient(line.item);
        ingredients.push({ id: null, ingredientId: ingredient.id, quantity: line.quantity, unit: line.unit, prep: line.prep });
      }
      return createRecipe({
        name: sample.name,
        serves: sample.serves,
        cuisine: sample.cuisine,
        mealTypes: sample.mealTypes,
        dietary: sample.dietary,
        tags: sample.tags,
        method: sample.method,
        ingredients,
      });
    },
    onSuccess: () => Promise.all([queryClient.invalidateQueries({ queryKey: recipeKeys.all }), queryClient.invalidateQueries({ queryKey: ingredientKeys.all })]),
  });
};
