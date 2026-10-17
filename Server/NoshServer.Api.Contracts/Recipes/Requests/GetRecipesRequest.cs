using NoshServer.Api.Contracts.Common;

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
}
