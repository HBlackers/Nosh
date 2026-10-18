using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Preferences.Responses;

/// <summary>
/// A set of preferences.
/// </summary>
/// <param name="Id">The preference identifier.</param>
/// <param name="Dietary">The dietary requirements the person's recipes should satisfy.</param>
public record UserPreferenceResponse(Guid Id, IReadOnlyList<DietaryRequirement> Dietary);
