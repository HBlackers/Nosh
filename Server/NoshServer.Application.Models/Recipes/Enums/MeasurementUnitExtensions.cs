namespace NoshServer.Application.Models.Recipes.Enums;

/// <summary>
/// Helpers for reading the category bits of a <see cref="MeasurementUnit"/>.
/// </summary>
public static class MeasurementUnitExtensions
{
    private const int CategoryMask = 0xF00;

    /// <summary>
    /// Gets the category the unit belongs to.
    /// </summary>
    public static MeasurementCategory GetCategory(this MeasurementUnit unit)
        => (MeasurementCategory)((int)unit & CategoryMask);

    /// <summary>
    /// Whether the two units belong to the same category.
    /// </summary>
    public static bool IsSameCategory(this MeasurementUnit unit, MeasurementUnit other)
        => ((int)unit & CategoryMask) == ((int)other & CategoryMask);
}
