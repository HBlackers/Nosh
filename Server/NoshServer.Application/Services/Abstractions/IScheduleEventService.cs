using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Schedules;

namespace NoshServer.Application.Services.Abstractions;

/// <summary>
/// Business logic for completing and skipping scheduled meals.
/// </summary>
public interface IScheduleEventService
{
    /// <summary>
    /// Gets one page of events, newest date first, optionally only those for one schedule and/or between two dates (inclusive).
    /// </summary>
    Task<PagedResult<ScheduleEvent>> GetPagedAsync(
        int page,
        int pageSize,
        Guid? scheduleId,
        DateOnly? from,
        DateOnly? to,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets an event, or null if it does not exist.
    /// </summary>
    Task<ScheduleEvent?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks a schedule's occurrence as completed or skipped. Completing it takes the recipe's ingredients out of stock,
    /// as much as there is of each; an ingredient that is used up is removed. Skipping leaves stock as it is.
    /// Throws a validation exception if the schedule doesn't exist or fall on the date, or the date already has an event.
    /// </summary>
    Task<ScheduleEvent> CreateAsync(ScheduleEvent scheduleEvent, CancellationToken cancellationToken = default);

    /// <summary>
    /// Saves an event that has already been loaded and had its status changed by the caller. Changing a skipped meal to
    /// completed takes its ingredients out of stock; changing a completed meal to skipped does not put them back.
    /// Throws a validation exception if it is invalid.
    /// </summary>
    Task<ScheduleEvent> UpdateAsync(ScheduleEvent scheduleEvent, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes an event so the occurrence is to come again. Stock that completing it used is not put back.
    /// The caller is expected to have checked that it exists.
    /// </summary>
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
