namespace NoshServer.Application.Models.Recipes.Enums;

/// <summary>
/// Dietary requirement a recipe satisfies.
/// </summary>
public enum DietaryRequirement
{
    /// <summary>
    /// Contains no meat or fish.
    /// </summary>
    Vegetarian,

    /// <summary>
    /// Contains no animal products.
    /// </summary>
    Vegan,

    /// <summary>
    /// Contains no gluten.
    /// </summary>
    GlutenFree,

    /// <summary>
    /// Contains no dairy.
    /// </summary>
    DairyFree,
}
