namespace NoshServer.Application.Models.Schedules.Enums;

/// <summary>
/// How often a scheduled recipe repeats.
/// </summary>
public enum RecurrenceFrequency
{
    /// <summary>
    /// Does not repeat; the recipe is planned once.
    /// </summary>
    None,

    /// <summary>
    /// Repeats every N days.
    /// </summary>
    Daily,

    /// <summary>
    /// Repeats every N weeks, on the chosen days of the week.
    /// </summary>
    Weekly,

    /// <summary>
    /// Repeats every N months, on the same day of the month as the start date
    /// (the last day of the month when that day doesn't exist).
    /// </summary>
    Monthly,
}
