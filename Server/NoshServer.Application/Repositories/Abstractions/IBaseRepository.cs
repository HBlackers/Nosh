using System.Linq.Expressions;
using NoshServer.Application.Models.Common;

namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Core create, read, update and (soft) delete operations shared by every repository.
/// </summary>
/// <typeparam name="TEntity">The entity type the repository works with.</typeparam>
public interface IBaseRepository<TEntity> where TEntity : BaseEntity
{
    /// <summary>
    /// Gets a non-deleted entity by its identifier, or null if it does not exist.
    /// </summary>
    /// <param name="id">The entity identifier.</param>
    /// <param name="filter">Optional extra condition the entity must also satisfy.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<TEntity?> GetByIdAsync(
        Guid id,
        Expression<Func<TEntity, bool>>? filter = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all non-deleted entities that satisfy the optional filter.
    /// </summary>
    /// <param name="filter">Optional condition to filter the entities by.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<List<TEntity>> GetAllAsync(
        Expression<Func<TEntity, bool>>? filter = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a new entity and sets its creation timestamp.
    /// </summary>
    Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing entity and sets its update timestamp.
    /// </summary>
    Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Soft deletes an entity. Returns false if no matching non-deleted entity exists.
    /// </summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
