using FluentValidation;
using NoshServer.Application.Helpers;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Schedules;
using NoshServer.Application.Models.Schedules.Enums;
using NoshServer.Application.Repositories.Abstractions;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Application.Services;

/// <inheritdoc cref="IRecipeScheduleService"/>
public class RecipeScheduleService(IRecipeScheduleRepository scheduleRepository, IValidator<RecipeSchedule> validator) : IRecipeScheduleService
{
    /// <inheritdoc />
    public async Task<PagedResult<ScheduleOccurrence>> GetOccurrencesAsync(
        DateOnly from,
        DateOnly to,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var schedules = await scheduleRepository.GetOverlappingAsync(from, to, cancellationToken);

        List<ScheduleOccurrence> occurrences =
        [
            .. schedules
                .SelectMany(schedule => ScheduleExpander.Expand(schedule, from, to)
                    .Select(date => new ScheduleOccurrence { Date = date, Schedule = schedule }))
                .OrderBy(o => o.Date)
                .ThenBy(o => o.Schedule.MealType),
        ];

        return new PagedResult<ScheduleOccurrence>
        {
            Items = [.. occurrences.Skip((page - 1) * pageSize).Take(pageSize)],
            Page = page,
            PageSize = pageSize,
            TotalCount = occurrences.Count,
        };
    }

    /// <inheritdoc />
    public Task<RecipeSchedule?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return scheduleRepository.GetByIdAsync(id, cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public async Task<RecipeSchedule> CreateAsync(RecipeSchedule schedule, CancellationToken cancellationToken = default)
    {
        Normalise(schedule);
        await validator.ValidateAndThrowAsync(schedule, cancellationToken);

        var created = await scheduleRepository.AddAsync(schedule, cancellationToken);

        // Reload so the response includes the recipe.
        return (await scheduleRepository.GetByIdAsync(created.Id, cancellationToken: cancellationToken))!;
    }

    /// <inheritdoc />
    public async Task<RecipeSchedule> UpdateAsync(RecipeSchedule schedule, CancellationToken cancellationToken = default)
    {
        Normalise(schedule);
        await validator.ValidateAndThrowAsync(schedule, cancellationToken);

        await scheduleRepository.UpdateAsync(schedule, cancellationToken);

        return (await scheduleRepository.GetByIdAsync(schedule.Id, cancellationToken: cancellationToken))!;
    }

    /// <inheritdoc />
    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await scheduleRepository.DeleteAsync(id, cancellationToken);
    }

    // A one-off has no recurrence settings; a repeating schedule only keeps the days that apply to its frequency.
    private static void Normalise(RecipeSchedule schedule)
    {
        if (schedule.Frequency == RecurrenceFrequency.None)
        {
            schedule.Interval = 1;
            schedule.DaysOfWeek = [];
            schedule.EndDate = null;
            schedule.MaxOccurrences = null;
            return;
        }

        schedule.DaysOfWeek = schedule.Frequency == RecurrenceFrequency.Weekly
            ? [.. schedule.DaysOfWeek.Distinct()]
            : [];
    }
}
