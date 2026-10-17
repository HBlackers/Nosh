using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Recipes.Sample.Responses;

/// <summary>
/// A sample recipe supplied from configuration. Sample recipes are not stored in the database.
/// </summary>
/// <param name="Slug">The URL-friendly unique name.</param>
/// <param name="Name">The recipe name.</param>
/// <param name="Cuisine">The cuisine.</param>
/// <param name="MealTypes">The meals the recipe is suitable for.</param>
/// <param name="Dietary">The dietary requirements the recipe satisfies.</param>
/// <param name="Tags">Tags describing the recipe.</param>
/// <param name="Serves">The number of people the recipe serves.</param>
/// <param name="Method">The method steps, in order.</param>
/// <param name="Ingredients">The ingredient lines.</param>
public record SampleRecipeResponse(
    string Slug,
    string Name,
    Cuisine Cuisine,
    IReadOnlyList<MealType> MealTypes,
    IReadOnlyList<DietaryRequirement> Dietary,
    IReadOnlyList<RecipeTag> Tags,
    int Serves,
    IReadOnlyList<string> Method,
    IReadOnlyList<SampleRecipeIngredientResponse> Ingredients);
