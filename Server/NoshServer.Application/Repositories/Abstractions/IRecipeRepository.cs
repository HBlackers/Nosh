using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Recipes;

namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Data access for <see cref="Recipe"/> entities. Recipes are read and written together with their ingredient lines.
/// </summary>
public interface IRecipeRepository : IBaseRepository<Recipe>
{
    /// <summary>
    /// Gets one page of recipes (without ingredient lines) ordered by name, optionally only those whose name contains the given text (ignoring case).
    /// </summary>
    Task<PagedResult<Recipe>> SearchAsync(
        int page,
        int pageSize,
        string? name,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns whether a non-deleted recipe with this slug exists, optionally excluding one recipe.
    /// </summary>
    Task<bool> ExistsBySlugAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default);
}
