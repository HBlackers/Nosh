using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Inventory.Requests;

/// <summary>
/// Request to add stock of an ingredient. If the ingredient is already in stock, the quantity is added to it.
/// </summary>
/// <param name="IngredientId">The ingredient being stocked.</param>
/// <param name="Quantity">The amount to add. Must be greater than zero.</param>
/// <param name="Unit">
/// The unit the quantity is measured in, or null for a plain count. When the ingredient is already in stock, this
/// must be convertible to its unit (grams with grams, any volume with any volume, a count unit only with itself).
/// </param>
public record AddStockRequest(Guid IngredientId, decimal Quantity, MeasurementUnit? Unit);
