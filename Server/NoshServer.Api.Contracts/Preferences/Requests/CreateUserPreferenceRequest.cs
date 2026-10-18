using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Preferences.Requests;

/// <summary>
/// Request to create a set of preferences.
/// </summary>
public record CreateUserPreferenceRequest
{
    /// <summary>
    /// Dietary requirements the person's recipes should satisfy. Empty (the default) means no requirements.
    /// </summary>
    public IReadOnlyList<DietaryRequirement> Dietary { get; init; } = [];
}
