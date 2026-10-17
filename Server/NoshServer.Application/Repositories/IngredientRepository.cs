using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using NoshServer.Application.Context;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Ingredients;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Repositories;

/// <inheritdoc cref="IIngredientRepository"/>
public class IngredientRepository(NoshContext context) : BaseRepository<Ingredient>(context), IIngredientRepository
{
    /// <inheritdoc />
    public Task<PagedResult<Ingredient>> SearchAsync(
        int page,
        int pageSize,
        string? name,
        CancellationToken cancellationToken = default)
    {
        var pattern = string.IsNullOrWhiteSpace(name) ? null : RepositoryHelpers.ContainsPattern(name.Trim());

        return GetPagedAsync(
            page,
            pageSize,
            pattern is null ? null : i => EF.Functions.ILike(i.Name, pattern, "\\"),
            query => query.OrderBy(i => i.Name),
            cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        // The Name column is case-insensitive (citext), so plain equality ignores case.
        return AnyAsync(i => i.Name == name, cancellationToken);
    }

    /// <inheritdoc />
    public override async Task<Ingredient> AddAsync(Ingredient entity, CancellationToken cancellationToken = default)
    {
        try
        {
            return await base.AddAsync(entity, cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.IsUniqueViolation())
        {
            throw DuplicateName();
        }
    }

    /// <inheritdoc />
    public override async Task<Ingredient> UpdateAsync(Ingredient entity, CancellationToken cancellationToken = default)
    {
        try
        {
            return await base.UpdateAsync(entity, cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.IsUniqueViolation())
        {
            throw DuplicateName();
        }
    }

    private static ValidationException DuplicateName()
    {
        return new ValidationException([new ValidationFailure(nameof(Ingredient.Name), "An ingredient with this name already exists.")]);
    }
}
