using NoshServer.Api.Contracts.Common;
using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Recipes.Requests;

/// <summary>
/// Query parameters for listing recipes.
/// </summary>
public record GetRecipesRequest : PagedRequest
{
    /// <summary>
    /// Optional text to search recipe names for. Case-insensitive, matches anywhere in the name.
    /// </summary>
    public string? Name { get; init; } = null;

    /// <summary>
    /// Optional dietary requirements. Only recipes that satisfy all of the given requirements are returned.
    /// Repeat the parameter to give more than one, for example <c>?dietary=Vegan&amp;dietary=GlutenFree</c>.
    /// </summary>
    public List<DietaryRequirement> Dietary { get; init; } = [];
}
