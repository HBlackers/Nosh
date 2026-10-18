using NoshServer.Api.Contracts.Preferences.Requests;
using NoshServer.Api.Contracts.Preferences.Responses;
using NoshServer.Application.Models.Preferences;

namespace NoshServer.Api.Mappers;

public static class UserPreferenceMappings
{
    public static UserPreference ToModel(this CreateUserPreferenceRequest request)
    {
        return new UserPreference { Dietary = [.. request.Dietary] };
    }

    /// <summary>
    /// Applies the request to an existing preference. Its id and timestamps are left as they are.
    /// </summary>
    public static void ApplyTo(this UpdateUserPreferenceRequest request, UserPreference preference)
    {
        preference.Dietary = [.. request.Dietary];
    }

    public static UserPreferenceResponse ToResponse(this UserPreference preference)
    {
        return new UserPreferenceResponse(preference.Id, preference.Dietary);
    }
}
