using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Inventory.Responses;

/// <summary>
/// An ingredient in stock.
/// </summary>
/// <param name="Id">The inventory item identifier.</param>
/// <param name="IngredientId">The ingredient in stock.</param>
/// <param name="IngredientName">The ingredient name.</param>
/// <param name="Quantity">The amount in stock.</param>
/// <param name="Unit">The unit the quantity is measured in, or null for a plain count.</param>
public record InventoryItemResponse(Guid Id, Guid IngredientId, string IngredientName, decimal Quantity, MeasurementUnit? Unit);
