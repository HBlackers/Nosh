using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Ingredients;

namespace NoshServer.Application.Services.Abstractions;

/// <summary>
/// Business logic for ingredients.
/// </summary>
public interface IIngredientService
{
    /// <summary>
    /// Gets one page of ingredients ordered by name, optionally filtered by name.
    /// </summary>
    Task<PagedResult<Ingredient>> GetPagedAsync(int page, int pageSize, string? name, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets an ingredient by its identifier, or null if it does not exist.
    /// </summary>
    Task<Ingredient?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates an ingredient. Throws a validation exception if the ingredient is invalid.
    /// </summary>
    Task<Ingredient> CreateAsync(Ingredient ingredient, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an ingredient's name, or returns null if it does not exist. Throws a validation exception if the new values are invalid.
    /// </summary>
    Task<Ingredient?> UpdateAsync(Guid id, Ingredient changes, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes an ingredient. Returns false if it does not exist.
    /// </summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
