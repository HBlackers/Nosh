using NoshServer.Application.Models.Schedules;
using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Application.Helpers;

/// <summary>
/// Works out the dates a <see cref="RecipeSchedule"/> falls on from its recurrence rule.
/// </summary>
public static class ScheduleExpander
{
    /// <summary>
    /// Gets the dates the schedule falls on between <paramref name="from"/> and <paramref name="to"/> (inclusive), in order.
    /// The end date and occurrence limit are counted from the schedule's start date, not from <paramref name="from"/>.
    /// </summary>
    public static IEnumerable<DateOnly> Expand(RecipeSchedule schedule, DateOnly from, DateOnly to)
    {
        var last = schedule.EndDate is { } end && end < to ? end : to;

        var dates = Sequence(schedule).TakeWhile(date => date <= last);

        if (schedule.MaxOccurrences is { } max)
        {
            dates = dates.Take(max);
        }

        return dates.Where(date => date >= from);
    }

    // Every date the schedule falls on from its start date, in order, without an end.
    private static IEnumerable<DateOnly> Sequence(RecipeSchedule schedule)
    {
        var interval = Math.Max(schedule.Interval, 1);

        switch (schedule.Frequency)
        {
            case RecurrenceFrequency.Daily:
                for (var date = schedule.StartDate; ; date = date.AddDays(interval))
                {
                    yield return date;
                }

            case RecurrenceFrequency.Weekly:
                var days = schedule.DaysOfWeek.Count > 0
                    ? schedule.DaysOfWeek.Distinct().OrderBy(DaysFromMonday).ToList()
                    : [schedule.StartDate.DayOfWeek];

                // Weeks start on Monday; "every N weeks" is counted from the week the schedule starts in.
                for (var weekStart = schedule.StartDate.AddDays(-DaysFromMonday(schedule.StartDate.DayOfWeek)); ; weekStart = weekStart.AddDays(7 * interval))
                {
                    foreach (var day in days)
                    {
                        var date = weekStart.AddDays(DaysFromMonday(day));
                        if (date >= schedule.StartDate)
                        {
                            yield return date;
                        }
                    }
                }

            case RecurrenceFrequency.Monthly:
                // Always counted from the start date so a 31st start gives the 30th/28th in short months, then the 31st again.
                for (var i = 0; ; i++)
                {
                    yield return schedule.StartDate.AddMonths(i * interval);
                }

            default:
                yield return schedule.StartDate;
                yield break;
        }
    }

    private static int DaysFromMonday(DayOfWeek day)
    {
        return ((int)day + 6) % 7;
    }
}
