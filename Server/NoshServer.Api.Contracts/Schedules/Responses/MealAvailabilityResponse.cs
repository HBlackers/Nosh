using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Api.Contracts.Schedules.Responses;

/// <summary>
/// How much of a planned meal's ingredients are in stock, once the meals before it have taken their share.
/// </summary>
/// <param name="Status">Ready when everything is in stock, Partial when some of it is, Missing when none of it is.</param>
/// <param name="IngredientsTotal">The number of ingredient lines in the recipe.</param>
/// <param name="IngredientsCovered">The number of ingredient lines the stock fully covers.</param>
/// <param name="Lacking">The ingredient lines the stock does not fully cover.</param>
public record MealAvailabilityResponse(
    MealAvailabilityStatus Status,
    int IngredientsTotal,
    int IngredientsCovered,
    IReadOnlyList<LackingIngredientResponse> Lacking);
