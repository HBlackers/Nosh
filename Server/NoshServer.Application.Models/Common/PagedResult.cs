namespace NoshServer.Application.Models.Common;

/// <summary>
/// One page of results together with the information needed to page through the rest.
/// </summary>
/// <typeparam name="T">The type of item in the page.</typeparam>
public class PagedResult<T>
{
    /// <summary>
    /// The items on this page.
    /// </summary>
    public List<T> Items { get; set; } = [];

    /// <summary>
    /// The 1-based page number.
    /// </summary>
    public int Page { get; set; }

    /// <summary>
    /// The maximum number of items per page.
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// The total number of items across all pages.
    /// </summary>
    public int TotalCount { get; set; }
}
