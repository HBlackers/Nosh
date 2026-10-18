namespace NoshServer.Application.Models.ShoppingLists.Enums;

/// <summary>
/// Whether the ingredients in stock cover what a shopping list item needs.
/// </summary>
public enum ShoppingListItemStatus
{
    /// <summary>
    /// There is not enough in stock, or none at all, so some needs buying.
    /// </summary>
    ToBuy,

    /// <summary>
    /// There is enough in stock. Nothing needs buying.
    /// </summary>
    Covered,

    /// <summary>
    /// The ingredient is in stock in a unit that can't be compared with the unit needed (for example tins against
    /// grams), so the full amount needed is shown to buy.
    /// </summary>
    UnitMismatch,
}
