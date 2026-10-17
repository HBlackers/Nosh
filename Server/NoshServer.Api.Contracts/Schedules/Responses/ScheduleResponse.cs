using NoshServer.Application.Models.Recipes.Enums;
using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Api.Contracts.Schedules.Responses;

/// <summary>
/// A schedule: a recipe planned once or repeating.
/// </summary>
/// <param name="Id">The schedule identifier.</param>
/// <param name="Recipe">The scheduled recipe.</param>
/// <param name="StartDate">The date of the first (or only) occurrence.</param>
/// <param name="MealType">The meal the recipe is planned for.</param>
/// <param name="Frequency">How often it repeats; None for a one-off.</param>
/// <param name="Interval">Repeats every this many days, weeks or months.</param>
/// <param name="DaysOfWeek">For weekly schedules, the days of the week it falls on.</param>
/// <param name="EndDate">The last date it can occur on, or null.</param>
/// <param name="MaxOccurrences">The total number of occurrences, or null.</param>
public record ScheduleResponse(
    Guid Id,
    ScheduleRecipeResponse Recipe,
    DateOnly StartDate,
    MealType MealType,
    RecurrenceFrequency Frequency,
    int Interval,
    IReadOnlyList<DayOfWeek> DaysOfWeek,
    DateOnly? EndDate,
    int? MaxOccurrences);
