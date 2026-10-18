using NoshServer.Application.Context;
using NoshServer.Application.Models.Preferences;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Repositories;

/// <inheritdoc cref="IUserPreferenceRepository"/>
public class UserPreferenceRepository(NoshContext context) : BaseRepository<UserPreference>(context), IUserPreferenceRepository;
