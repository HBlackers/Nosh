using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Models.Recipes.Enums;
using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Application.Models.Schedules;

/// <summary>
/// A recipe planned on the calendar, either once or repeating. A repeating schedule is stored as a rule;
/// the individual dates are worked out when the calendar is read.
/// </summary>
public class RecipeSchedule : BaseEntity
{
    /// <summary>
    /// Identifier of the scheduled recipe.
    /// </summary>
    public Guid RecipeId { get; set; }

    /// <summary>
    /// The date of the first (or only) occurrence.
    /// </summary>
    public DateOnly StartDate { get; set; }

    /// <summary>
    /// The meal the recipe is planned for.
    /// </summary>
    public MealType MealType { get; set; }

    /// <summary>
    /// How often the schedule repeats. <see cref="RecurrenceFrequency.None"/> means a one-off.
    /// </summary>
    public RecurrenceFrequency Frequency { get; set; } = RecurrenceFrequency.None;

    /// <summary>
    /// Repeats every this many days, weeks or months, depending on <see cref="Frequency"/>.
    /// </summary>
    public int Interval { get; set; } = 1;

    /// <summary>
    /// For weekly schedules, the days of the week the recipe is planned on.
    /// </summary>
    public List<DayOfWeek> DaysOfWeek { get; set; } = [];

    /// <summary>
    /// The last date the schedule can occur on, or null if it does not end by date.
    /// </summary>
    public DateOnly? EndDate { get; set; } = null;

    /// <summary>
    /// The total number of occurrences, counted from the start date, or null if it does not end by count.
    /// </summary>
    public int? MaxOccurrences { get; set; } = null;

    /// <summary>
    /// The scheduled recipe. Null unless loaded with Include.
    /// </summary>
    public virtual Recipe? Recipe { get; set; } = null;
}
