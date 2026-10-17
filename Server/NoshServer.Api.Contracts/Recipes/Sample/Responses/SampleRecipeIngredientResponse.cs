using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Recipes.Sample.Responses;

/// <summary>
/// An ingredient line of a sample recipe.
/// </summary>
/// <param name="Item">The ingredient name.</param>
/// <param name="Quantity">The amount, or null when no amount applies.</param>
/// <param name="Unit">The unit the quantity is measured in, or null for a plain count.</param>
/// <param name="Prep">Preparation note, or null.</param>
public record SampleRecipeIngredientResponse(
    string Item,
    decimal? Quantity,
    MeasurementUnit? Unit,
    string? Prep);
