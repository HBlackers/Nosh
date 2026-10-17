using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Ingredients;
using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Application.Models.Recipes;

/// <summary>
/// A single ingredient line in a recipe: which ingredient, how much, and how it is prepared.
/// </summary>
public class RecipeIngredient : BaseEntity
{
    /// <summary>
    /// Identifier of the recipe this line belongs to.
    /// </summary>
    public Guid RecipeId { get; set; }

    /// <summary>
    /// Identifier of the ingredient used.
    /// </summary>
    public Guid IngredientId { get; set; }

    /// <summary>
    /// Amount of the ingredient, or null when no amount applies (for example "salt and pepper").
    /// </summary>
    public decimal? Quantity { get; set; } = null;

    /// <summary>
    /// Unit the quantity is measured in, or null for a plain count (for example "4 sausages").
    /// </summary>
    public MeasurementUnit? Unit { get; set; } = null;

    /// <summary>
    /// Preparation note, for example "chopped", or null if none.
    /// </summary>
    public string? Prep { get; set; } = null;

    /// <summary>
    /// Position of this line within the recipe's ingredient list.
    /// </summary>
    public int SortOrder { get; set; }

    /// <summary>
    /// The recipe this line belongs to. Null unless loaded with Include.
    /// </summary>
    public virtual Recipe? Recipe { get; set; } = null;

    /// <summary>
    /// The ingredient used. Null unless loaded with Include.
    /// </summary>
    public virtual Ingredient? Ingredient { get; set; } = null;
}
