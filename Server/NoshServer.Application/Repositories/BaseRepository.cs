using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using NoshServer.Application.Context;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Repositories;

/// <summary>
/// Base repository providing the core CRUD operations against <see cref="NoshContext"/>.
/// Timestamps and soft deletes are handled here. Queries are untracked (see <see cref="NoshContext"/>).
/// </summary>
/// <typeparam name="TEntity">The entity type the repository works with.</typeparam>
public abstract class BaseRepository<TEntity>(NoshContext context) : IBaseRepository<TEntity>
    where TEntity : BaseEntity
{
    /// <summary>
    /// The database context.
    /// </summary>
    private NoshContext Context { get; } = context;

    /// <summary>
    /// The entity set. Does not exclude soft-deleted rows; use <see cref="Query"/> for reads.
    /// </summary>
    private DbSet<TEntity> DbSet => Context.Set<TEntity>();

    /// <inheritdoc />
    public virtual Task<TEntity?> GetByIdAsync(
        Guid id,
        Expression<Func<TEntity, bool>>? filter = null,
        CancellationToken cancellationToken = default)
    {
        return Query(filter).FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public virtual Task<List<TEntity>> GetAllAsync(
        Expression<Func<TEntity, bool>>? filter = null,
        CancellationToken cancellationToken = default)
    {
        return Query(filter).ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public virtual async Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        entity.CreatedAt = DateTimeOffset.UtcNow;

        DbSet.Add(entity);
        await SaveAndDetachAsync(entity, cancellationToken);

        return entity;
    }

    /// <inheritdoc />
    public virtual async Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        // Marks only this entity (not its navigations) as modified, and leaves the
        // creation and soft-delete columns untouched.
        var entry = Context.Entry(entity);
        entry.State = EntityState.Modified;
        entry.Property(e => e.CreatedAt).IsModified = false;
        entry.Property(e => e.DeletedAt).IsModified = false;
        entry.Property(e => e.IsDeleted).IsModified = false;

        await SaveAndDetachAsync(entity, cancellationToken);

        return entity;
    }

    /// <inheritdoc />
    public virtual async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;

        var affected = await Query()
            .Where(e => e.Id == id)
            .ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(e => e.IsDeleted, true)
                    .SetProperty(e => e.DeletedAt, now),
                cancellationToken);

        return affected > 0;
    }

    /// <summary>
    /// Starts a read query that excludes soft-deleted rows, with the optional filter applied.
    /// </summary>
    private IQueryable<TEntity> Query(Expression<Func<TEntity, bool>>? filter = null)
    {
        var query = DbSet.Where(e => !e.IsDeleted);

        return filter is null ? query : query.Where(filter);
    }

    private async Task SaveAndDetachAsync(TEntity entity, CancellationToken cancellationToken)
    {
        await Context.SaveChangesAsync(cancellationToken);
        Context.Entry(entity).State = EntityState.Detached;
    }
}
