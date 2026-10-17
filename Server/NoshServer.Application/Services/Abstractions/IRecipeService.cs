using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Recipes;

namespace NoshServer.Application.Services.Abstractions;

/// <summary>
/// Business logic for recipes and their ingredient lines.
/// </summary>
public interface IRecipeService
{
    /// <summary>
    /// Gets one page of recipes (without ingredient lines) ordered by name, optionally filtered by name.
    /// </summary>
    Task<PagedResult<Recipe>> GetPagedAsync(int page, int pageSize, string? name, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a recipe with its ingredient lines, or null if it does not exist.
    /// </summary>
    Task<Recipe?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a recipe and its ingredient lines. The slug is derived from the name.
    /// Throws a validation exception if the recipe is invalid.
    /// </summary>
    Task<Recipe> CreateAsync(Recipe recipe, CancellationToken cancellationToken = default);

    /// <summary>
    /// Replaces a recipe's details and ingredient lines, or returns null if it does not exist. The slug does not change.
    /// Lines with an id are updated, lines without one are added, and existing lines left out are removed.
    /// Throws a validation exception if the new values are invalid.
    /// </summary>
    Task<Recipe?> UpdateAsync(Guid id, Recipe changes, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a recipe and its ingredient lines. Returns false if it does not exist.
    /// </summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
