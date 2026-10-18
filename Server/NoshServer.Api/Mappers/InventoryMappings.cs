using NoshServer.Api.Contracts.Inventory.Requests;
using NoshServer.Api.Contracts.Inventory.Responses;
using NoshServer.Application.Models.Inventory;

namespace NoshServer.Api.Mappers;

public static class InventoryMappings
{
    /// <summary>
    /// Applies the request to an existing inventory item. Its id, ingredient and timestamps are left as they are.
    /// </summary>
    public static void ApplyTo(this UpdateInventoryItemRequest request, InventoryItem item)
    {
        item.Quantity = request.Quantity;
        item.Unit = request.Unit;
    }

    public static InventoryItemResponse ToResponse(this InventoryItem item)
    {
        return new InventoryItemResponse(item.Id, item.IngredientId, item.Ingredient?.Name ?? string.Empty, item.Quantity, item.Unit);
    }
}
