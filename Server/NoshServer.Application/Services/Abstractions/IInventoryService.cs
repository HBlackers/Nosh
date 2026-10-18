using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Inventory;
using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Application.Services.Abstractions;

/// <summary>
/// Business logic for the ingredients in stock.
/// </summary>
public interface IInventoryService
{
    /// <summary>
    /// Gets one page of inventory items ordered by ingredient name, optionally filtered by ingredient name.
    /// </summary>
    Task<PagedResult<InventoryItem>> GetPagedAsync(int page, int pageSize, string? name, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets an inventory item with its ingredient, or null if it does not exist.
    /// </summary>
    Task<InventoryItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds stock of an ingredient. If the ingredient is already in stock, the quantity is converted and added to
    /// the existing item, which moves to the smaller of the two units. Throws a validation exception if the stock
    /// is invalid or its unit can't be combined with the existing item's.
    /// </summary>
    Task<InventoryItem> AddStockAsync(
        Guid ingredientId,
        decimal quantity,
        MeasurementUnit? unit,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Saves an inventory item that has already been loaded and updated by the caller.
    /// Throws a validation exception if it is invalid.
    /// </summary>
    Task<InventoryItem> UpdateAsync(InventoryItem item, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes an inventory item. The caller is expected to have checked that it exists.
    /// </summary>
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
