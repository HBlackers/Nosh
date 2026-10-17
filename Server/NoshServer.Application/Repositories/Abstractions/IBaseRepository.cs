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
    /// <param name="include">Optional shaping of the query, typically to include related entities.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<TEntity?> GetByIdAsync(
        Guid id,
        Expression<Func<TEntity, bool>>? filter = null,
        Func<IQueryable<TEntity>, IQueryable<TEntity>>? include = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all non-deleted entities that satisfy the optional filter.
    /// </summary>
    /// <param name="filter">Optional condition to filter the entities by.</param>
    /// <param name="include">Optional shaping of the query, typically to include related entities.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<List<TEntity>> GetAllAsync(
        Expression<Func<TEntity, bool>>? filter = null,
        Func<IQueryable<TEntity>, IQueryable<TEntity>>? include = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets one page of non-deleted entities that satisfy the optional filter.
    /// </summary>
    /// <param name="page">The 1-based page number.</param>
    /// <param name="pageSize">The maximum number of items per page.</param>
    /// <param name="filter">Optional condition to filter the entities by.</param>
    /// <param name="orderBy">Optional ordering. Defaults to creation time, then identifier, so paging is stable.</param>
    /// <param name="include">Optional shaping of the query, typically to include related entities.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<PagedResult<TEntity>> GetPagedAsync(
        int page,
        int pageSize,
        Expression<Func<TEntity, bool>>? filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        Func<IQueryable<TEntity>, IQueryable<TEntity>>? include = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns whether any non-deleted entity satisfies the filter.
    /// </summary>
    Task<bool> AnyAsync(Expression<Func<TEntity, bool>> filter, CancellationToken cancellationToken = default);

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
