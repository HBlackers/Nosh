namespace NoshServer.Application.Models.Schedules.Enums;

/// <summary>
/// What happened to a scheduled recipe on one of its dates.
/// </summary>
public enum ScheduleEventStatus
{
    /// <summary>
    /// The meal was made. The ingredients it used were taken out of stock.
    /// </summary>
    Completed,

    /// <summary>
    /// The meal was not made. Stock is left as it was.
    /// </summary>
    Skipped,
}
