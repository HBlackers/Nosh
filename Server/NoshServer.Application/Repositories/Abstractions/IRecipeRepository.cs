using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Data access for <see cref="Recipe"/> entities. Recipes are read and written together with their ingredient lines.
/// </summary>
public interface IRecipeRepository : IBaseRepository<Recipe>
{
    /// <summary>
    /// Gets one page of recipes (without ingredient lines) ordered by name, optionally only those whose name contains the given
    /// text (ignoring case) and that satisfy all of the given dietary requirements.
    /// </summary>
    Task<PagedResult<Recipe>> SearchAsync(
        int page,
        int pageSize,
        string? name,
        IReadOnlyCollection<DietaryRequirement> dietary,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the non-deleted recipes with the given identifiers, each with its ingredient lines.
    /// </summary>
    Task<List<Recipe>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns whether a non-deleted recipe with this slug exists, optionally excluding one recipe.
    /// </summary>
    Task<bool> ExistsBySlugAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default);
}
