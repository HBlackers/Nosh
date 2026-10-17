using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Recipes.Responses;

/// <summary>
/// A full recipe, including its method and ingredient lines.
/// </summary>
/// <param name="Id">The recipe identifier.</param>
/// <param name="Name">The recipe name.</param>
/// <param name="Slug">The URL-friendly unique name.</param>
/// <param name="Serves">The number of people the recipe serves.</param>
/// <param name="Cuisine">The cuisine.</param>
/// <param name="MealTypes">The meals the recipe is suitable for.</param>
/// <param name="Dietary">The dietary requirements the recipe satisfies.</param>
/// <param name="Tags">Tags describing the recipe.</param>
/// <param name="Method">The method steps, in order.</param>
/// <param name="Ingredients">The ingredient lines, in order.</param>
public record RecipeResponse(
    Guid Id,
    string Name,
    string Slug,
    int Serves,
    Cuisine Cuisine,
    IReadOnlyList<MealType> MealTypes,
    IReadOnlyList<DietaryRequirement> Dietary,
    IReadOnlyList<RecipeTag> Tags,
    IReadOnlyList<string> Method,
    IReadOnlyList<RecipeIngredientResponse> Ingredients);
