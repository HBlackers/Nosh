using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Application.Models.Schedules;

/// <summary>
/// How much of a planned meal's ingredients are in stock, once the meals before it have taken their share.
/// Worked out when the calendar is read; not stored in the database.
/// </summary>
/// <param name="Status">Whether everything, something or nothing the meal needs is in stock.</param>
/// <param name="IngredientsTotal">The number of ingredient lines in the recipe.</param>
/// <param name="IngredientsCovered">The number of ingredient lines the stock fully covers.</param>
/// <param name="Lacking">The ingredient lines the stock does not fully cover.</param>
public record MealAvailability(
    MealAvailabilityStatus Status,
    int IngredientsTotal,
    int IngredientsCovered,
    IReadOnlyList<LackingIngredient> Lacking);
