using NoshServer.Api.Contracts.Common;

namespace NoshServer.Api.Contracts.Ingredients.Requests;

/// <summary>
/// Query parameters for listing ingredients.
/// </summary>
public record GetIngredientsRequest : PagedRequest
{
    /// <summary>
    /// Optional text to search ingredient names for. Case-insensitive, matches anywhere in the name.
    /// </summary>
    public string? Name { get; init; } = null;
}
