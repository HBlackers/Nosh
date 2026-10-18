using System.Linq.Expressions;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using NoshServer.Application.Context;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Models.Recipes.Enums;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Repositories;

/// <inheritdoc cref="IRecipeRepository"/>
public class RecipeRepository(NoshContext context) : BaseRepository<Recipe>(context), IRecipeRepository
{
    // A recipe is always loaded with its non-deleted ingredient lines, in order, and each line's ingredient.
    private static readonly Func<IQueryable<Recipe>, IQueryable<Recipe>> WithIngredients = query => query
        .Include(r => r.Ingredients!.Where(l => !l.IsDeleted).OrderBy(l => l.SortOrder))
        .ThenInclude(l => l.Ingredient);

    /// <inheritdoc />
    public Task<PagedResult<Recipe>> SearchAsync(
        int page,
        int pageSize,
        string? name,
        IReadOnlyCollection<DietaryRequirement> dietary,
        CancellationToken cancellationToken = default)
    {
        var pattern = RepositoryHelpers.ContainsPattern(name);
        string[] required = [.. dietary.Distinct().Select(d => d.ToString())];

        // "Dietary" is a text[] column, so @> means the recipe's list contains every requested value.
        var source = Context.Recipes.FromSql($"""
            SELECT * FROM "Recipes"
            WHERE "Name" ILIKE {pattern} ESCAPE '\'
              AND "Dietary" @> {required}
            """);

        return GetPagedAsync(source, page, pageSize, query => query.OrderBy(r => r.Name), cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public Task<List<Recipe>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken = default)
    {
        return GetAllAsync(r => ids.Contains(r.Id), WithIngredients, cancellationToken);
    }

    /// <inheritdoc />
    public Task<bool> ExistsBySlugAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default)
    {
        return AnyAsync(r => r.Slug == slug && (excludeId == null || r.Id != excludeId), cancellationToken);
    }

    /// <inheritdoc />
    public override Task<Recipe?> GetByIdAsync(
        Guid id,
        Expression<Func<Recipe, bool>>? filter = null,
        Func<IQueryable<Recipe>, IQueryable<Recipe>>? include = null,
        CancellationToken cancellationToken = default)
    {
        return base.GetByIdAsync(id, filter, include ?? WithIngredients, cancellationToken);
    }

    /// <summary>
    /// Adds the recipe together with its ingredient lines.
    /// </summary>
    public override async Task<Recipe> AddAsync(Recipe entity, CancellationToken cancellationToken = default)
    {
        var lines = entity.Ingredients ?? [];
        var now = DateTimeOffset.UtcNow;
        foreach (var line in lines)
        {
            line.CreatedAt = now;
        }

        try
        {
            return await base.AddAsync(entity, cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.IsUniqueViolation())
        {
            throw DuplicateName();
        }
        finally
        {
            Detach(lines);
        }
    }

    /// <summary>
    /// Updates the recipe and reconciles its ingredient lines in one transaction: lines with an existing id are
    /// updated, lines without an id are added, and existing lines that are no longer present are soft deleted.
    /// </summary>
    public override async Task<Recipe> UpdateAsync(Recipe entity, CancellationToken cancellationToken = default)
    {
        var lines = entity.Ingredients ?? [];
        var now = DateTimeOffset.UtcNow;

        await using var transaction = await Context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            List<Guid> keptIds = [.. lines.Where(l => l.Id != Guid.Empty).Select(l => l.Id)];
            await Context.RecipeIngredients
                .Where(l => l.RecipeId == entity.Id && !l.IsDeleted && !keptIds.Contains(l.Id))
                .ExecuteUpdateAsync(
                    setters => setters
                        .SetProperty(l => l.IsDeleted, true)
                        .SetProperty(l => l.DeletedAt, now),
                    cancellationToken);

            foreach (var line in lines)
            {
                line.RecipeId = entity.Id;
                var entry = Context.Entry(line);

                if (line.Id == Guid.Empty)
                {
                    line.CreatedAt = now;
                    entry.State = EntityState.Added;
                }
                else
                {
                    line.UpdatedAt = now;
                    entry.State = EntityState.Modified;
                    entry.Property(l => l.CreatedAt).IsModified = false;
                    entry.Property(l => l.DeletedAt).IsModified = false;
                    entry.Property(l => l.IsDeleted).IsModified = false;
                }
            }

            var result = await base.UpdateAsync(entity, cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return result;
        }
        catch (DbUpdateException exception) when (exception.IsUniqueViolation())
        {
            throw DuplicateName();
        }
        finally
        {
            Detach(lines);
        }
    }

    /// <summary>
    /// Soft deletes the recipe together with its ingredient lines and its schedules.
    /// </summary>
    public override async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;

        await using var transaction = await Context.Database.BeginTransactionAsync(cancellationToken);

        await Context.RecipeIngredients
            .Where(l => l.RecipeId == id && !l.IsDeleted)
            .ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(l => l.IsDeleted, true)
                    .SetProperty(l => l.DeletedAt, now),
                cancellationToken);

        await Context.RecipeSchedules
            .Where(s => s.RecipeId == id && !s.IsDeleted)
            .ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(s => s.IsDeleted, true)
                    .SetProperty(s => s.DeletedAt, now),
                cancellationToken);

        var deleted = await base.DeleteAsync(id, cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return deleted;
    }

    private void Detach(IEnumerable<RecipeIngredient> lines)
    {
        foreach (var line in lines)
        {
            Context.Entry(line).State = EntityState.Detached;
        }
    }

    // Two concurrent requests can both pass the validator; the unique index catches the second.
    private static ValidationException DuplicateName()
    {
        return new ValidationException([new ValidationFailure(nameof(Recipe.Name), "A recipe with this name already exists.")]);
    }
}
