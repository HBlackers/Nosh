using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Recipes.Responses;

/// <summary>
/// One ingredient line of a recipe.
/// </summary>
/// <param name="Id">The line identifier.</param>
/// <param name="IngredientId">The ingredient identifier.</param>
/// <param name="IngredientName">The ingredient name.</param>
/// <param name="Quantity">The amount, or null when no amount applies.</param>
/// <param name="Unit">The unit the quantity is measured in, or null for a plain count.</param>
/// <param name="Prep">Preparation note, or null.</param>
public record RecipeIngredientResponse(
    Guid Id,
    Guid IngredientId,
    string IngredientName,
    decimal? Quantity,
    MeasurementUnit? Unit,
    string? Prep);
