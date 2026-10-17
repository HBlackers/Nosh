using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using Npgsql;
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
        var pattern = string.IsNullOrWhiteSpace(name) ? null : $"%{EscapeLike(name.Trim())}%";

        return GetPagedAsync(
            page,
            pageSize,
            pattern is null ? null : i => EF.Functions.ILike(i.Name, pattern, "\\"),
            query => query.OrderBy(i => i.Name),
            cancellationToken);
    }

    /// <inheritdoc />
    public Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken cancellationToken = default)
    {
        // The Name column is case-insensitive (citext), so plain equality ignores case.
        return AnyAsync(i => i.Name == name && (excludeId == null || i.Id != excludeId), cancellationToken);
    }

    /// <inheritdoc />
    public override async Task<Ingredient> AddAsync(Ingredient entity, CancellationToken cancellationToken = default)
    {
        try
        {
            return await base.AddAsync(entity, cancellationToken);
        }
        catch (DbUpdateException exception) when (IsUniqueViolation(exception))
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
        catch (DbUpdateException exception) when (IsUniqueViolation(exception))
        {
            throw DuplicateName();
        }
    }

    // Two concurrent requests can both pass the validator; the unique index catches the second.
    private static bool IsUniqueViolation(DbUpdateException exception)
    {
        return exception.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation };
    }

    private static ValidationException DuplicateName()
    {
        return new ValidationException([new ValidationFailure(nameof(Ingredient.Name), "An ingredient with this name already exists.")]);
    }

    private static string EscapeLike(string value)
    {
        return value.Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_");
    }
}
