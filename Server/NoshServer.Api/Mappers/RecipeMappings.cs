using NoshServer.Api.Contracts.Recipes.Requests;
using NoshServer.Api.Contracts.Recipes.Responses;
using NoshServer.Application.Models.Recipes;

namespace NoshServer.Api.Mappers;

public static class RecipeMappings
{
    public static Recipe ToModel(this CreateRecipeRequest request)
    {
        return new Recipe
        {
            Name = request.Name,
            Serves = request.Serves,
            Cuisine = request.Cuisine,
            MealTypes = request.MealTypes,
            Dietary = request.Dietary,
            Tags = request.Tags,
            Method = request.Method,
            Ingredients = [.. request.Ingredients.Select(ToModel)],
        };
    }

    public static Recipe ToModel(this UpdateRecipeRequest request)
    {
        return new Recipe
        {
            Name = request.Name,
            Serves = request.Serves,
            Cuisine = request.Cuisine,
            MealTypes = request.MealTypes,
            Dietary = request.Dietary,
            Tags = request.Tags,
            Method = request.Method,
            Ingredients = [.. request.Ingredients.Select(ToModel)],
        };
    }

    public static RecipeSummaryResponse ToSummaryResponse(this Recipe recipe)
    {
        return new RecipeSummaryResponse(
            recipe.Id,
            recipe.Name,
            recipe.Slug,
            recipe.Serves,
            recipe.Cuisine,
            recipe.MealTypes,
            recipe.Dietary,
            recipe.Tags);
    }

    public static RecipeResponse ToResponse(this Recipe recipe)
    {
        return new RecipeResponse(
            recipe.Id,
            recipe.Name,
            recipe.Slug,
            recipe.Serves,
            recipe.Cuisine,
            recipe.MealTypes,
            recipe.Dietary,
            recipe.Tags,
            recipe.Method,
            [.. (recipe.Ingredients ?? []).Select(ToResponse)]);
    }

    private static RecipeIngredient ToModel(RecipeIngredientRequest request)
    {
        return new RecipeIngredient
        {
            Id = request.Id ?? Guid.Empty,
            IngredientId = request.IngredientId,
            Quantity = request.Quantity,
            Unit = request.Unit,
            Prep = request.Prep,
        };
    }

    private static RecipeIngredientResponse ToResponse(RecipeIngredient line)
    {
        return new RecipeIngredientResponse(
            line.Id,
            line.IngredientId,
            line.Ingredient?.Name ?? string.Empty,
            line.Quantity,
            line.Unit,
            line.Prep);
    }
}
