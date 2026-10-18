using FluentValidation;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Preferences;
using NoshServer.Application.Repositories.Abstractions;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Application.Services;

/// <inheritdoc cref="IUserPreferenceService"/>
public class UserPreferenceService(IUserPreferenceRepository preferenceRepository, IValidator<UserPreference> validator) : IUserPreferenceService
{
    /// <inheritdoc />
    public Task<PagedResult<UserPreference>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        return preferenceRepository.GetPagedAsync(page, pageSize, cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public Task<UserPreference?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return preferenceRepository.GetByIdAsync(id, cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public async Task<UserPreference> CreateAsync(UserPreference preference, CancellationToken cancellationToken = default)
    {
        Normalise(preference);
        await validator.ValidateAndThrowAsync(preference, cancellationToken);

        return await preferenceRepository.AddAsync(preference, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<UserPreference> UpdateAsync(UserPreference preference, CancellationToken cancellationToken = default)
    {
        Normalise(preference);
        await validator.ValidateAndThrowAsync(preference, cancellationToken);

        return await preferenceRepository.UpdateAsync(preference, cancellationToken);
    }

    /// <inheritdoc />
    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await preferenceRepository.DeleteAsync(id, cancellationToken);
    }

    private static void Normalise(UserPreference preference)
    {
        preference.Dietary = [.. preference.Dietary.Distinct()];
    }
}
