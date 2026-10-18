using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Application.Models.Schedules;

/// <summary>
/// What happened to a <see cref="RecipeSchedule"/> on one of its dates: it was completed or skipped.
/// A schedule has at most one event for each date.
/// </summary>
public class ScheduleEvent : BaseEntity
{
    /// <summary>
    /// Identifier of the schedule the event belongs to.
    /// </summary>
    public Guid ScheduleId { get; set; }

    /// <summary>
    /// The date of the schedule's occurrence that the event is for.
    /// </summary>
    public DateOnly Date { get; set; }

    /// <summary>
    /// Whether the occurrence was completed or skipped.
    /// </summary>
    public ScheduleEventStatus Status { get; set; }

    /// <summary>
    /// The schedule the event belongs to. Null unless loaded with Include.
    /// </summary>
    public virtual RecipeSchedule? Schedule { get; set; } = null;
}
