namespace NoshServer.Application.Models.Common;

/// <summary>
/// Base class for all database entities. Provides the primary key, audit timestamps and soft-delete flags.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Unique identifier of the entity.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// When the entity was created (UTC).
    /// </summary>
    public DateTimeOffset CreatedAt { get; set; }

    /// <summary>
    /// When the entity was last updated (UTC), or null if it has never been updated.
    /// </summary>
    public DateTimeOffset? UpdatedAt { get; set; } = null;

    /// <summary>
    /// When the entity was soft deleted (UTC), or null if it has not been deleted.
    /// </summary>
    public DateTimeOffset? DeletedAt { get; set; } = null;

    /// <summary>
    /// Whether the entity has been soft deleted. Soft deleted entities are excluded from queries.
    /// </summary>
    public bool IsDeleted { get; set; }
}
