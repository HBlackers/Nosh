using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Preferences.Requests;

/// <summary>
/// Request to replace a set of preferences.
/// </summary>
public record UpdateUserPreferenceRequest
{
    /// <summary>
    /// Dietary requirements the person's recipes should satisfy. Empty (the default) means no requirements.
    /// </summary>
    public IReadOnlyList<DietaryRequirement> Dietary { get; init; } = [];
}
