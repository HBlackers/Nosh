using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Recipes;

namespace NoshServer.Application.Models.Ingredients;

/// <summary>
/// An ingredient in the shared catalogue, reused by any number of recipes.
/// </summary>
public class Ingredient : BaseEntity
{
    /// <summary>
    /// Unique name of the ingredient, for example "chopped tomatoes".
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Recipe lines that use this ingredient. Null unless loaded with Include.
    /// </summary>
    public virtual List<RecipeIngredient>? RecipeIngredients { get; set; } = null;
}
