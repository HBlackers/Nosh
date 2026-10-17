namespace NoshServer.Application.Models.Schedules;

/// <summary>
/// One date a <see cref="RecipeSchedule"/> falls on. Worked out from the schedule's rule; not stored in the database.
/// </summary>
public class ScheduleOccurrence
{
    /// <summary>
    /// The date of the occurrence.
    /// </summary>
    public required DateOnly Date { get; init; }

    /// <summary>
    /// The schedule the occurrence belongs to.
    /// </summary>
    public required RecipeSchedule Schedule { get; init; }
}
