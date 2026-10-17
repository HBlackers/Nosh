using NoshServer.Api.Contracts.Common;
using NoshServer.Application.Models.Common;

namespace NoshServer.Api.Mappers;

public static class PagedMappings
{
    /// <summary>
    /// Maps a paged model result to a paged response, converting each item with <paramref name="map"/>.
    /// </summary>
    public static PagedResponse<TResponse> ToResponse<TModel, TResponse>(this PagedResult<TModel> result, Func<TModel, TResponse> map)
    {
        return new PagedResponse<TResponse>(result.Items.Select(map).ToList(), result.Page, result.PageSize, result.TotalCount);
    }
}
