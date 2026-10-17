using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Recipes.Requests;

/// <summary>
/// Request to create a recipe. The slug is derived from the name.
/// </summary>
/// <param name="Name">The recipe name.</param>
/// <param name="Serves">The number of people the recipe serves.</param>
/// <param name="Cuisine">The cuisine.</param>
/// <param name="MealTypes">The meals the recipe is suitable for. At least one.</param>
/// <param name="Dietary">The dietary requirements the recipe satisfies.</param>
/// <param name="Tags">Tags describing the recipe.</param>
/// <param name="Method">The method steps, in order. At least one.</param>
/// <param name="Ingredients">The ingredient lines, in order. At least one.</param>
public record CreateRecipeRequest(
    string Name,
    int Serves,
    Cuisine Cuisine,
    List<MealType> MealTypes,
    List<DietaryRequirement> Dietary,
    List<RecipeTag> Tags,
    List<string> Method,
    List<RecipeIngredientRequest> Ingredients);
