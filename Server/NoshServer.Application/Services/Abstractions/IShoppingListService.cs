using NoshServer.Application.Models.ShoppingLists;

namespace NoshServer.Application.Services.Abstractions;

/// <summary>
/// Business logic for the shopping list: what the planned recipes need, compared with what is in stock.
/// </summary>
public interface IShoppingListService
{
    /// <summary>
    /// Works out what the recipes planned between the two dates (inclusive) need and how much of it is still to buy.
    /// Repeating schedules count once for each date they fall on. Amounts in units that can be converted are added
    /// together; the rest are listed separately.
    /// </summary>
    Task<ShoppingList> GetAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken = default);
}
