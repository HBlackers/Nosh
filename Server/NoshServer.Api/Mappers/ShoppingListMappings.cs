using NoshServer.Api.Contracts.Common;
using NoshServer.Api.Contracts.Schedules.Responses;
using NoshServer.Api.Contracts.ShoppingLists.Responses;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.ShoppingLists;

namespace NoshServer.Api.Mappers;

public static class ShoppingListMappings
{
    public static ShoppingListResponse ToResponse(this ShoppingList list)
    {
        return new ShoppingListResponse(
            list.From,
            list.To,
            [.. list.Items.Select(ToResponse)],
            [.. list.UnplannedStock.Select(InventoryMappings.ToResponse)]);
    }

    private static ShoppingListItemResponse ToResponse(ShoppingListItem item)
    {
        return new ShoppingListItemResponse(
            item.IngredientId,
            item.IngredientName,
            item.Needed?.ToResponse(),
            item.InStock?.ToResponse(),
            item.ToBuy?.ToResponse(),
            item.Status,
            [.. item.Recipes.Select(r => new ScheduleRecipeResponse(r.Id, r.Name, r.Slug))]);
    }

    private static QuantityResponse ToResponse(this Quantity quantity)
    {
        return new QuantityResponse(quantity.Amount, quantity.Unit);
    }
}
