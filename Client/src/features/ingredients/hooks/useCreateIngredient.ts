import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIngredient, ingredientKeys } from "../api/ingredients.queries";

export const useCreateIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIngredient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
};
