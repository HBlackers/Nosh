namespace NoshServer.Application.Models.Recipes.Enums;

/// <summary>
/// Category a <see cref="MeasurementUnit"/> belongs to, stored in the unit's high bits.
/// Units in the same category can be compared or combined.
/// </summary>
public enum MeasurementCategory
{
    /// <summary>
    /// Units measured by weight.
    /// </summary>
    Mass = 0x100,

    /// <summary>
    /// Units measured by volume.
    /// </summary>
    Volume = 0x200,

    /// <summary>
    /// Units measured by counting items.
    /// </summary>
    Count = 0x400,
}
