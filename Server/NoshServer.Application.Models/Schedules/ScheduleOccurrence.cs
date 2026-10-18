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

    /// <summary>
    /// Whether the occurrence has been completed or skipped, or null if it is still to come.
    /// </summary>
    public ScheduleEvent? Event { get; init; } = null;

    /// <summary>
    /// How much of the meal's ingredients are in stock. Null once the occurrence has been completed or skipped.
    /// </summary>
    public MealAvailability? Availability { get; init; } = null;
}
