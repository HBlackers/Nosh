using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Schedules;

namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Data access for <see cref="ScheduleEvent"/> entities.
/// </summary>
public interface IScheduleEventRepository : IBaseRepository<ScheduleEvent>
{
    /// <summary>
    /// Gets one page of events, newest date first, optionally only those for one schedule and/or between two dates (inclusive).
    /// </summary>
    Task<PagedResult<ScheduleEvent>> SearchAsync(
        int page,
        int pageSize,
        Guid? scheduleId,
        DateOnly? from,
        DateOnly? to,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the events for occurrences that fall between the two dates (inclusive).
    /// </summary>
    Task<List<ScheduleEvent>> GetInRangeAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken = default);
}
