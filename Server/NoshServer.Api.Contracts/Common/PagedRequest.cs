using System.ComponentModel.DataAnnotations;

namespace NoshServer.Api.Contracts.Common;

/// <summary>
/// Paging parameters shared by every list endpoint.
/// </summary>
public record PagedRequest
{
    /// <summary>
    /// The 1-based page number. Defaults to 1.
    /// </summary>
    [Range(1, int.MaxValue)]
    public int Page { get; init; } = 1;

    /// <summary>
    /// The number of items per page, from 1 to 100. Defaults to 20.
    /// </summary>
    [Range(1, 100)]
    public int PageSize { get; init; } = 20;
}
