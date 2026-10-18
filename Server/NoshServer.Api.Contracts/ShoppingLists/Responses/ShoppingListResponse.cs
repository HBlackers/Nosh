using NoshServer.Api.Contracts.Inventory.Responses;

namespace NoshServer.Api.Contracts.ShoppingLists.Responses;

/// <summary>
/// What the recipes planned between two dates need, compared with what is in stock.
/// </summary>
/// <param name="From">The first date of the range, inclusive.</param>
/// <param name="To">The last date of the range, inclusive.</param>
/// <param name="Items">The ingredients needed, ordered by name.</param>
/// <param name="UnplannedStock">Ingredients in stock that none of the planned recipes use, ordered by name.</param>
public record ShoppingListResponse(
    DateOnly From,
    DateOnly To,
    IReadOnlyList<ShoppingListItemResponse> Items,
    IReadOnlyList<InventoryItemResponse> UnplannedStock);
