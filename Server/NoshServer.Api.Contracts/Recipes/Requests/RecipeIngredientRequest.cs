using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Recipes.Requests;

/// <summary>
/// One ingredient line of a recipe. The order of the lines in the request is the order they are shown in.
/// </summary>
/// <param name="Id">
/// When updating a recipe: the id of an existing line to update, or null to add a new line.
/// Existing lines that are left out of the request are removed. Ignored when creating a recipe.
/// </param>
/// <param name="IngredientId">The ingredient used.</param>
/// <param name="Quantity">The amount, or null when no amount applies.</param>
/// <param name="Unit">The unit the quantity is measured in, or null for a plain count. Requires a quantity.</param>
/// <param name="Prep">Preparation note, for example "chopped", or null.</param>
public record RecipeIngredientRequest(
    Guid? Id,
    Guid IngredientId,
    decimal? Quantity,
    MeasurementUnit? Unit,
    string? Prep);
