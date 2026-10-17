import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipe, recipeKeys } from "../api/recipes.queries";

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecipe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recipeKeys.all }),
  });
};
