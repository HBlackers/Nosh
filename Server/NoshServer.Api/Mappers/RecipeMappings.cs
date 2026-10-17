using NoshServer.Api.Contracts.Recipes.Requests;
using NoshServer.Api.Contracts.Recipes.Responses;
using NoshServer.Api.Contracts.Recipes.Sample.Responses;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Models.Recipes.Sample;

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
            Ingredients = [.. request.Ingredients.Select(line => line.ToModel())],
        };
    }

    /// <summary>
    /// Applies the request to an existing recipe. Its id, slug and timestamps are left as they are.
    /// The ingredient lines are replaced by the requested ones; lines keep their id when the request gives one.
    /// </summary>
    public static void ApplyTo(this UpdateRecipeRequest request, Recipe recipe)
    {
        recipe.Name = request.Name;
        recipe.Serves = request.Serves;
        recipe.Cuisine = request.Cuisine;
        recipe.MealTypes = request.MealTypes;
        recipe.Dietary = request.Dietary;
        recipe.Tags = request.Tags;
        recipe.Method = request.Method;
        recipe.Ingredients = [.. request.Ingredients.Select(line => line.ToModel(recipe.Id))];
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

    public static SampleRecipeResponse ToResponse(this SampleRecipe recipe)
    {
        return new SampleRecipeResponse(
            recipe.Slug,
            recipe.Name,
            recipe.Cuisine,
            recipe.MealTypes,
            recipe.Dietary,
            recipe.Tags,
            recipe.Serves,
            recipe.Method,
            [.. recipe.Ingredients.Select(i => new SampleRecipeIngredientResponse(i.Item, i.Quantity, i.Unit, i.Prep))]);
    }

    private static RecipeIngredient ToModel(this RecipeIngredientRequest request, Guid recipeId = default)
    {
        return new RecipeIngredient
        {
            Id = request.Id ?? Guid.Empty,
            RecipeId = recipeId,
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
