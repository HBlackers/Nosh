using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Api.Contracts.Schedules.Requests;

/// <summary>
/// Request to mark one occurrence of a schedule as completed or skipped.
/// </summary>
public record CreateScheduleEventRequest
{
    /// <summary>
    /// The schedule the occurrence belongs to.
    /// </summary>
    public required Guid ScheduleId { get; init; }

    /// <summary>
    /// The date of the occurrence. The schedule must fall on this date.
    /// </summary>
    public required DateOnly Date { get; init; }

    /// <summary>
    /// Whether the meal was completed or skipped. Completing it takes its ingredients out of stock.
    /// </summary>
    public required ScheduleEventStatus Status { get; init; }
}
