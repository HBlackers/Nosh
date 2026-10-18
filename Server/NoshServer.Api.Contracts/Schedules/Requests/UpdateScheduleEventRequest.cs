using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Api.Contracts.Schedules.Requests;

/// <summary>
/// Request to change what happened to an occurrence.
/// </summary>
/// <param name="Status">
/// Whether the meal was completed or skipped. Changing a skipped meal to completed takes its ingredients out of stock;
/// changing a completed meal to skipped does not put them back.
/// </param>
public record UpdateScheduleEventRequest(ScheduleEventStatus Status);
