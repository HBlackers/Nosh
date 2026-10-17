using NoshServer.Application.Models.Recipes.Enums;
using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Api.Contracts.Schedules.Requests;

/// <summary>
/// Request to schedule a recipe, once or repeating.
/// </summary>
public record CreateScheduleRequest
{
    /// <summary>
    /// The recipe to schedule.
    /// </summary>
    public required Guid RecipeId { get; init; }

    /// <summary>
    /// The date of the first (or only) occurrence.
    /// </summary>
    public required DateOnly StartDate { get; init; }

    /// <summary>
    /// The meal the recipe is planned for.
    /// </summary>
    public required MealType MealType { get; init; }

    /// <summary>
    /// How often it repeats. <c>None</c> (the default) means a one-off.
    /// </summary>
    public RecurrenceFrequency Frequency { get; init; } = RecurrenceFrequency.None;

    /// <summary>
    /// Repeats every this many days, weeks or months. Defaults to 1.
    /// </summary>
    public int Interval { get; init; } = 1;

    /// <summary>
    /// For weekly schedules, the days of the week it falls on. At least one is needed for a weekly schedule.
    /// </summary>
    public List<DayOfWeek> DaysOfWeek { get; init; } = [];

    /// <summary>
    /// The last date it can occur on. Give this or <see cref="MaxOccurrences"/>, not both; give neither to repeat forever.
    /// </summary>
    public DateOnly? EndDate { get; init; } = null;

    /// <summary>
    /// The total number of occurrences, counted from the start date.
    /// </summary>
    public int? MaxOccurrences { get; init; } = null;
}
