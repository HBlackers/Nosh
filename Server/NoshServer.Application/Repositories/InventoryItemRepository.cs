using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using NoshServer.Application.Context;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Inventory;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Repositories;

/// <inheritdoc cref="IInventoryItemRepository"/>
public class InventoryItemRepository(NoshContext context) : BaseRepository<InventoryItem>(context), IInventoryItemRepository
{
    /// <inheritdoc />
    public Task<PagedResult<InventoryItem>> SearchAsync(
        int page,
        int pageSize,
        string? name,
        CancellationToken cancellationToken = default)
    {
        var pattern = RepositoryHelpers.ContainsPattern(name);

        return GetPagedAsync(
            page,
            pageSize,
            i => EF.Functions.ILike(i.Ingredient!.Name, pattern, "\\"),
            query => query.OrderBy(i => i.Ingredient!.Name),
            query => query.Include(i => i.Ingredient),
            cancellationToken);
    }

    /// <inheritdoc />
    public Task<InventoryItem?> GetWithIngredientAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return GetByIdAsync(id, include: query => query.Include(i => i.Ingredient), cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public async Task<InventoryItem?> GetByIngredientIdAsync(Guid ingredientId, CancellationToken cancellationToken = default)
    {
        var items = await GetAllAsync(i => i.IngredientId == ingredientId, cancellationToken: cancellationToken);

        return items.FirstOrDefault();
    }

    /// <inheritdoc />
    public override async Task<InventoryItem> AddAsync(InventoryItem entity, CancellationToken cancellationToken = default)
    {
        try
        {
            return await base.AddAsync(entity, cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.IsUniqueViolation())
        {
            throw new ValidationException([new ValidationFailure(nameof(InventoryItem.IngredientId), "This ingredient is already in stock.")]);
        }
    }
}
