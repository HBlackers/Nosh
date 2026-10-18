namespace NoshServer.Application.Models.Recipes.Enums;

/// <summary>
/// Unit an ingredient quantity is measured in.
/// The high bits hold the unit's <see cref="MeasurementCategory"/> and the low bits identify the unit within it.
/// </summary>
public enum MeasurementUnit
{
    /// <summary>
    /// Grams (g).
    /// </summary>
    Gram = MeasurementCategory.Mass | 1,

    /// <summary>
    /// Millilitres (ml).
    /// </summary>
    Millilitre = MeasurementCategory.Volume | 1,

    /// <summary>
    /// Tablespoons (tbsp).
    /// </summary>
    Tablespoon = MeasurementCategory.Volume | 2,

    /// <summary>
    /// Teaspoons (tsp).
    /// </summary>
    Teaspoon = MeasurementCategory.Volume | 3,

    /// <summary>
    /// Tins.
    /// </summary>
    Tin = MeasurementCategory.Count | 1,

    /// <summary>
    /// Cloves.
    /// </summary>
    Clove = MeasurementCategory.Count | 2,

    /// <summary>
    /// Slices.
    /// </summary>
    Slice = MeasurementCategory.Count | 3,

    /// <summary>
    /// A thumb-sized piece.
    /// </summary>
    Thumb = MeasurementCategory.Count | 4,

    /// <summary>
    /// A handful.
    /// </summary>
    Handful = MeasurementCategory.Count | 5,

    /// <summary>
    /// Rashers.
    /// </summary>
    Rasher = MeasurementCategory.Count | 6,

    /// <summary>
    /// Balls.
    /// </summary>
    Ball = MeasurementCategory.Count | 7,
}
