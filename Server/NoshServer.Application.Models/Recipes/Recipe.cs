using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Application.Models.Recipes;

/// <summary>
/// A recipe that is available to users.
/// </summary>
public class Recipe : BaseEntity
{
    /// <summary>
    /// Display name of the recipe, for example "Spaghetti Bolognese".
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// URL-friendly, unique identifier derived from the name, for example "spaghetti-bolognese".
    /// </summary>
    public string Slug { get; set; } = string.Empty;

    /// <summary>
    /// Number of people the recipe serves.
    /// </summary>
    public int Serves { get; set; }

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
    /// Ordered method steps, one string per step.
    /// </summary>
    public List<string> Method { get; set; } = [];

    /// <summary>
    /// Ingredient lines that make up the recipe. Null unless loaded with Include.
    /// </summary>
    public virtual List<RecipeIngredient>? Ingredients { get; set; } = null;
}
