namespace NoshServer.Application.Models.Schedules.Enums;

/// <summary>
/// How much of a planned meal's ingredients are in stock.
/// </summary>
public enum MealAvailabilityStatus
{
    /// <summary>
    /// Everything the meal needs is in stock.
    /// </summary>
    Ready,

    /// <summary>
    /// Some of what the meal needs is in stock, but not all of it.
    /// </summary>
    Partial,

    /// <summary>
    /// None of what the meal needs is in stock.
    /// </summary>
    Missing,
}
