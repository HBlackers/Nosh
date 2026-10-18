using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Preferences;

namespace NoshServer.Application.Services.Abstractions;

/// <summary>
/// Business logic for user preferences.
/// </summary>
public interface IUserPreferenceService
{
    /// <summary>
    /// Gets one page of preferences, oldest first.
    /// </summary>
    Task<PagedResult<UserPreference>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a preference by its identifier, or null if it does not exist.
    /// </summary>
    Task<UserPreference?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a preference. Throws a validation exception if it is invalid.
    /// </summary>
    Task<UserPreference> CreateAsync(UserPreference preference, CancellationToken cancellationToken = default);

    /// <summary>
    /// Saves a preference that has already been loaded and updated by the caller.
    /// Throws a validation exception if it is invalid.
    /// </summary>
    Task<UserPreference> UpdateAsync(UserPreference preference, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a preference. The caller is expected to have checked that it exists.
    /// </summary>
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
