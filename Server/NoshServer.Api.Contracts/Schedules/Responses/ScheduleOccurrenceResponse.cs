using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Schedules.Responses;

/// <summary>
/// One date a schedule falls on.
/// </summary>
/// <param name="ScheduleId">The schedule the occurrence belongs to.</param>
/// <param name="Date">The date of the occurrence.</param>
/// <param name="MealType">The meal the recipe is planned for.</param>
/// <param name="IsRecurring">Whether the schedule repeats.</param>
/// <param name="Recipe">The scheduled recipe.</param>
public record ScheduleOccurrenceResponse(
    Guid ScheduleId,
    DateOnly Date,
    MealType MealType,
    bool IsRecurring,
    ScheduleRecipeResponse Recipe);
