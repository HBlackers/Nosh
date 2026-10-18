namespace NoshServer.Application.Models.Recipes.Enums;

/// <summary>
/// Helpers for reading the category bits of a <see cref="MeasurementUnit"/> and converting quantities between units.
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

    /// <summary>
    /// Whether a quantity in this unit can be converted to the other unit. Mass and volume units convert within
    /// their own category. Count units only match themselves, as 2 tins can't be turned into cloves.
    /// A null unit is a plain count and only matches null.
    /// </summary>
    public static bool CanConvertTo(this MeasurementUnit? unit, MeasurementUnit? other)
    {
        if (unit == other)
        {
            return true;
        }

        if (unit is not { } from || other is not { } to)
        {
            return false;
        }

        return from.IsSameCategory(to) && from.GetCategory() != MeasurementCategory.Count;
    }

    /// <summary>
    /// Converts a quantity from this unit to the other. The caller is expected to have checked
    /// <see cref="CanConvertTo"/> first.
    /// </summary>
    public static decimal Convert(this MeasurementUnit? unit, decimal quantity, MeasurementUnit? other)
    {
        if (unit == other)
        {
            return quantity;
        }

        return quantity * unit.BaseFactor() / other.BaseFactor();
    }

    /// <summary>
    /// Of two convertible units, the one with the smaller base size, so combined quantities stay whole where possible
    /// (2 tbsp + 10 ml is 40 ml rather than 2.67 tbsp).
    /// </summary>
    public static MeasurementUnit? Smaller(this MeasurementUnit? unit, MeasurementUnit? other)
        => unit.BaseFactor() <= other.BaseFactor() ? unit : other;

    /// <summary>
    /// How many of the category's base unit (grams for mass, millilitres for volume) one of this unit is.
    /// Count units are their own base.
    /// </summary>
    private static decimal BaseFactor(this MeasurementUnit? unit) => unit switch
    {
        MeasurementUnit.Teaspoon => 5m,
        MeasurementUnit.Tablespoon => 15m,
        _ => 1m,
    };
}
