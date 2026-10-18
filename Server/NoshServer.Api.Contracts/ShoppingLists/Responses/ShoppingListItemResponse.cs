using NoshServer.Api.Contracts.Common;
using NoshServer.Api.Contracts.Inventory.Responses;
using NoshServer.Api.Contracts.Schedules.Responses;
using NoshServer.Application.Models.ShoppingLists.Enums;

namespace NoshServer.Api.Contracts.ShoppingLists.Responses;

/// <summary>
/// One ingredient the planned recipes need, compared with what is in stock. An ingredient the recipes measure in
/// units that can't be combined (for example grams and a plain count) appears once for each.
/// </summary>
/// <param name="IngredientId">The ingredient identifier.</param>
/// <param name="IngredientName">The ingredient name.</param>
/// <param name="Needed">
/// The total needed across the planned recipes, or null when they use the ingredient without an amount.
/// </param>
/// <param name="InStock">
/// The ingredient's inventory item, or null if it is not in stock. Set even when its unit can't be compared with the
/// amount needed.
/// </param>
/// <param name="ToBuy">
/// How much is still to buy, in the smaller of the needed and stocked units, or null when nothing is left to buy
/// or no amount applies.
/// </param>
/// <param name="Status">Whether the stock covers the need.</param>
/// <param name="Recipes">The planned recipes that need this item.</param>
public record ShoppingListItemResponse(
    Guid IngredientId,
    string IngredientName,
    QuantityResponse? Needed,
    InventoryItemResponse? InStock,
    QuantityResponse? ToBuy,
    ShoppingListItemStatus Status,
    IReadOnlyList<ScheduleRecipeResponse> Recipes);
