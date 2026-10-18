using FluentValidation;
using FluentValidation.Results;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Inventory;
using NoshServer.Application.Models.Recipes.Enums;
using NoshServer.Application.Repositories.Abstractions;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Application.Services;

/// <inheritdoc cref="IInventoryService"/>
public class InventoryService(IInventoryItemRepository inventoryItemRepository, IValidator<InventoryItem> validator) : IInventoryService
{
    /// <inheritdoc />
    public Task<PagedResult<InventoryItem>> GetPagedAsync(int page, int pageSize, string? name, CancellationToken cancellationToken = default)
    {
        return inventoryItemRepository.SearchAsync(page, pageSize, name, cancellationToken);
    }

    /// <inheritdoc />
    public Task<InventoryItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return inventoryItemRepository.GetWithIngredientAsync(id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<InventoryItem> AddStockAsync(
        Guid ingredientId,
        decimal quantity,
        MeasurementUnit? unit,
        CancellationToken cancellationToken = default)
    {
        var stock = new InventoryItem { IngredientId = ingredientId, Quantity = quantity, Unit = unit };
        await validator.ValidateAndThrowAsync(stock, cancellationToken);

        var existing = await inventoryItemRepository.GetByIngredientIdAsync(ingredientId, cancellationToken);
        if (existing is null)
        {
            var added = await inventoryItemRepository.AddAsync(stock, cancellationToken);
            return (await inventoryItemRepository.GetWithIngredientAsync(added.Id, cancellationToken))!;
        }

        if (!existing.Unit.CanConvertTo(unit))
        {
            throw new ValidationException([new ValidationFailure(
                nameof(InventoryItem.Unit),
                $"This ingredient is stocked in {UnitName(existing.Unit)}, which can't be combined with {UnitName(unit)}.")]);
        }

        var target = existing.Unit.Smaller(unit);
        existing.Quantity = existing.Unit.Convert(existing.Quantity, target) + unit.Convert(quantity, target);
        existing.Unit = target;

        await inventoryItemRepository.UpdateAsync(existing, cancellationToken);

        return (await inventoryItemRepository.GetWithIngredientAsync(existing.Id, cancellationToken))!;
    }

    /// <inheritdoc />
    public async Task<InventoryItem> UpdateAsync(InventoryItem item, CancellationToken cancellationToken = default)
    {
        await validator.ValidateAndThrowAsync(item, cancellationToken);

        return await inventoryItemRepository.UpdateAsync(item, cancellationToken);
    }

    /// <inheritdoc />
    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await inventoryItemRepository.DeleteAsync(id, cancellationToken);
    }

    private static string UnitName(MeasurementUnit? unit) => unit?.ToString() ?? "a plain count";
}
