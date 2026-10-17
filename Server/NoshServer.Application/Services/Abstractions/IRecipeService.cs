using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Models.Recipes.Enums;
using NoshServer.Application.Models.Recipes.Sample;

namespace NoshServer.Application.Services.Abstractions;

/// <summary>
/// Business logic for recipes and their ingredient lines.
/// </summary>
public interface IRecipeService
{
    /// <summary>
    /// Gets one page of recipes (without ingredient lines) ordered by name, optionally filtered by name and by dietary
    /// requirements (a recipe must satisfy all of the given requirements).
    /// </summary>
    Task<PagedResult<Recipe>> GetPagedAsync(
        int page,
        int pageSize,
        string? name,
        IReadOnlyCollection<DietaryRequirement> dietary,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets one page of the sample recipes loaded from configuration, ordered as configured, optionally filtered by name and by
    /// dietary requirements (a recipe must satisfy all of the given requirements). These are not stored in the database.
    /// </summary>
    PagedResult<SampleRecipe> GetSampleRecipes(int page, int pageSize, string? name, IReadOnlyCollection<DietaryRequirement> dietary);

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
    /// Saves a recipe that has already been loaded and updated by the caller, together with its ingredient lines.
    /// Lines with an id are updated, lines without one are added, and existing lines that are no longer present are removed.
    /// Throws a validation exception if the recipe is invalid.
    /// </summary>
    Task<Recipe> UpdateAsync(Recipe recipe, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a recipe and its ingredient lines. The caller is expected to have checked that it exists.
    /// </summary>
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
