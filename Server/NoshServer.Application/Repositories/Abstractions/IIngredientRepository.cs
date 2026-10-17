using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Ingredients;

namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Data access for <see cref="Ingredient"/> entities.
/// </summary>
public interface IIngredientRepository : IBaseRepository<Ingredient>
{
    /// <summary>
    /// Gets one page of ingredients ordered by name, optionally only those whose name contains the given text (ignoring case).
    /// </summary>
    Task<PagedResult<Ingredient>> SearchAsync(
        int page,
        int pageSize,
        string? name,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns whether a non-deleted ingredient with this name exists (ignoring case), optionally excluding one ingredient.
    /// </summary>
    Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken cancellationToken = default);
}
