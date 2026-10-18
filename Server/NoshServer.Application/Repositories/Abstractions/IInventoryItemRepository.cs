using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Inventory;

namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Data access for <see cref="InventoryItem"/> entities.
/// </summary>
public interface IInventoryItemRepository : IBaseRepository<InventoryItem>
{
    /// <summary>
    /// Gets one page of inventory items with their ingredient, ordered by ingredient name, optionally only those
    /// whose ingredient name contains the given text (ignoring case).
    /// </summary>
    Task<PagedResult<InventoryItem>> SearchAsync(
        int page,
        int pageSize,
        string? name,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets an inventory item with its ingredient, or null if it does not exist.
    /// </summary>
    Task<InventoryItem?> GetWithIngredientAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the inventory item for an ingredient, or null if the ingredient is not in stock.
    /// </summary>
    Task<InventoryItem?> GetByIngredientIdAsync(Guid ingredientId, CancellationToken cancellationToken = default);
}
