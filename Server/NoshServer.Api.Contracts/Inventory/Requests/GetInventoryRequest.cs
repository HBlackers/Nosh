using NoshServer.Api.Contracts.Common;

namespace NoshServer.Api.Contracts.Inventory.Requests;

/// <summary>
/// Query parameters for listing the inventory.
/// </summary>
public record GetInventoryRequest : PagedRequest
{
    /// <summary>
    /// Optional text to search ingredient names for. Case-insensitive, matches anywhere in the name.
    /// </summary>
    public string? Name { get; init; } = null;
}
