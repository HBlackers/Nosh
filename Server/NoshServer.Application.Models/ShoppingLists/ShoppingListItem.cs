using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Inventory;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Models.ShoppingLists.Enums;

namespace NoshServer.Application.Models.ShoppingLists;

/// <summary>
/// One ingredient the planned recipes need, in one unit, compared with what is in stock. Worked out when the
/// shopping list is read; not stored in the database.
/// </summary>
public class ShoppingListItem
{
    /// <summary>
    /// Identifier of the ingredient needed.
    /// </summary>
    public required Guid IngredientId { get; init; }

    /// <summary>
    /// Name of the ingredient needed.
    /// </summary>
    public required string IngredientName { get; init; }

    /// <summary>
    /// Total needed across the planned recipes, or null when the recipes use the ingredient without an amount
    /// (for example "salt and pepper").
    /// </summary>
    public Quantity? Needed { get; init; } = null;

    /// <summary>
    /// The ingredient's inventory item, or null if it is not in stock. Set even when its unit can't be compared
    /// with <see cref="Needed"/>.
    /// </summary>
    public InventoryItem? InStock { get; init; } = null;

    /// <summary>
    /// How much is still to buy, in the smaller of the needed and stocked units, or null when nothing is left to buy
    /// or no amount applies.
    /// </summary>
    public Quantity? ToBuy { get; init; } = null;

    /// <summary>
    /// Whether the stock covers the need.
    /// </summary>
    public required ShoppingListItemStatus Status { get; init; }

    /// <summary>
    /// The planned recipes that need this item.
    /// </summary>
    public required IReadOnlyList<Recipe> Recipes { get; init; }
}
