using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Application.Models.Recipes.Sample;

/// <summary>
/// An ingredient line of a <see cref="SampleRecipe"/>, loaded from configuration.
/// </summary>
public class SampleRecipeIngredient
{
    /// <summary>
    /// Name of the ingredient, for example "chopped tomatoes".
    /// </summary>
    public string Item { get; set; } = string.Empty;

    /// <summary>
    /// Amount of the ingredient, or null when no amount applies.
    /// </summary>
    public decimal? Quantity { get; set; } = null;

    /// <summary>
    /// Unit the quantity is measured in, or null for a plain count.
    /// </summary>
    public MeasurementUnit? Unit { get; set; } = null;

    /// <summary>
    /// Preparation note, for example "chopped", or null if none.
    /// </summary>
    public string? Prep { get; set; } = null;
}
