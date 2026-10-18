using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using NoshServer.Application.Context;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Schedules;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Repositories;

/// <inheritdoc cref="IScheduleEventRepository"/>
public class ScheduleEventRepository(NoshContext context) : BaseRepository<ScheduleEvent>(context), IScheduleEventRepository
{
    /// <inheritdoc />
    public Task<PagedResult<ScheduleEvent>> SearchAsync(
        int page,
        int pageSize,
        Guid? scheduleId,
        DateOnly? from,
        DateOnly? to,
        CancellationToken cancellationToken = default)
    {
        return GetPagedAsync(
            page,
            pageSize,
            e => (scheduleId == null || e.ScheduleId == scheduleId)
                 && (from == null || e.Date >= from)
                 && (to == null || e.Date <= to),
            query => query.OrderByDescending(e => e.Date).ThenBy(e => e.Id),
            cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public Task<List<ScheduleEvent>> GetInRangeAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken = default)
    {
        return GetAllAsync(e => e.Date >= from && e.Date <= to, cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public override async Task<ScheduleEvent> AddAsync(ScheduleEvent entity, CancellationToken cancellationToken = default)
    {
        try
        {
            return await base.AddAsync(entity, cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.IsUniqueViolation())
        {
            throw new ValidationException([new ValidationFailure(nameof(ScheduleEvent.Date), "This meal has already been completed or skipped.")]);
        }
    }
}
