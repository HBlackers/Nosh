using NoshServer.Application.Models.Common;

namespace NoshServer.Application.Models.Schedules;

/// <summary>
/// An ingredient line of a planned meal that the stock does not fully cover.
/// </summary>
/// <param name="IngredientId">The ingredient identifier.</param>
/// <param name="IngredientName">The ingredient name.</param>
/// <param name="Needed">The amount the meal needs, or null when the recipe gives no amount.</param>
/// <param name="Available">
/// What is left in stock for the meal, or null if the ingredient is not in stock. When the ingredient is stocked in a
/// unit that can't be compared with the amount needed, this is that stock in its own unit.
/// </param>
public record LackingIngredient(Guid IngredientId, string IngredientName, Quantity? Needed, Quantity? Available);
