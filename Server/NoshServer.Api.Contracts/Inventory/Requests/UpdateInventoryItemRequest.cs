using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Inventory.Requests;

/// <summary>
/// Request to set how much of an ingredient is in stock.
/// </summary>
/// <param name="Quantity">The new amount. Must be greater than zero; delete the item when it runs out.</param>
/// <param name="Unit">The unit the quantity is measured in, or null for a plain count.</param>
public record UpdateInventoryItemRequest(decimal Quantity, MeasurementUnit? Unit);
