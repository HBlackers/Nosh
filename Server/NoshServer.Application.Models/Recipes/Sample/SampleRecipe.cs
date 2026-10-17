using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Application.Models.Recipes.Sample;

/// <summary>
/// A sample recipe loaded from configuration. It is not a database entity; it is identified by its slug and ingredients are referred to by name.
/// </summary>
public class SampleRecipe
{
    /// <summary>
    /// URL-friendly unique name, for example "full-english-breakfast".
    /// </summary>
    public string Slug { get; set; } = string.Empty;

    /// <summary>
    /// Display name of the recipe.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Cuisine the recipe belongs to.
    /// </summary>
    public Cuisine Cuisine { get; set; }

    /// <summary>
    /// Meals the recipe is suitable for.
    /// </summary>
    public List<MealType> MealTypes { get; set; } = [];

    /// <summary>
    /// Dietary requirements the recipe satisfies.
    /// </summary>
    public List<DietaryRequirement> Dietary { get; set; } = [];

    /// <summary>
    /// Tags describing the recipe.
    /// </summary>
    public List<RecipeTag> Tags { get; set; } = [];

    /// <summary>
    /// Number of people the recipe serves.
    /// </summary>
    public int Serves { get; set; }

    /// <summary>
    /// Ordered method steps, one string per step.
    /// </summary>
    public List<string> Method { get; set; } = [];

    /// <summary>
    /// Ingredient lines that make up the recipe.
    /// </summary>
    public List<SampleRecipeIngredient> Ingredients { get; set; } = [];
}
