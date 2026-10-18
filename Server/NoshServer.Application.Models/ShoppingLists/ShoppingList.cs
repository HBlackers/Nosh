using NoshServer.Application.Models.Inventory;

namespace NoshServer.Application.Models.ShoppingLists;

/// <summary>
/// What the recipes planned between two dates need, compared with what is in stock. Worked out when it is read;
/// not stored in the database.
/// </summary>
public class ShoppingList
{
    /// <summary>
    /// The first date of the range, inclusive.
    /// </summary>
    public required DateOnly From { get; init; }

    /// <summary>
    /// The last date of the range, inclusive.
    /// </summary>
    public required DateOnly To { get; init; }

    /// <summary>
    /// The ingredients needed, ordered by name.
    /// </summary>
    public required IReadOnlyList<ShoppingListItem> Items { get; init; }

    /// <summary>
    /// Inventory items for ingredients that none of the planned recipes use, ordered by name.
    /// </summary>
    public required IReadOnlyList<InventoryItem> UnplannedStock { get; init; }
}
