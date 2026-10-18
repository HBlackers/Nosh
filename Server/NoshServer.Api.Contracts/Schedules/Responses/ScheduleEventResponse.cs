using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Api.Contracts.Schedules.Responses;

/// <summary>
/// What happened to a schedule on one of its dates.
/// </summary>
/// <param name="Id">The event identifier.</param>
/// <param name="ScheduleId">The schedule the event belongs to.</param>
/// <param name="Date">The date of the occurrence.</param>
/// <param name="Status">Whether the meal was completed or skipped.</param>
public record ScheduleEventResponse(Guid Id, Guid ScheduleId, DateOnly Date, ScheduleEventStatus Status);
