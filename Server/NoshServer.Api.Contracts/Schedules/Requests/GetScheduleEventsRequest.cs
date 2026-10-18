using NoshServer.Api.Contracts.Common;

namespace NoshServer.Api.Contracts.Schedules.Requests;

/// <summary>
/// Query parameters for listing schedule events.
/// </summary>
public record GetScheduleEventsRequest : PagedRequest
{
    /// <summary>
    /// Optional schedule to list the events of.
    /// </summary>
    public Guid? ScheduleId { get; init; } = null;

    /// <summary>
    /// Optional first date of the range, inclusive.
    /// </summary>
    public DateOnly? From { get; init; } = null;

    /// <summary>
    /// Optional last date of the range, inclusive.
    /// </summary>
    public DateOnly? To { get; init; } = null;
}
