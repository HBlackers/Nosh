using NoshServer.Application.Models.Preferences;

namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Data access for <see cref="UserPreference"/> entities.
/// </summary>
public interface IUserPreferenceRepository : IBaseRepository<UserPreference>;
