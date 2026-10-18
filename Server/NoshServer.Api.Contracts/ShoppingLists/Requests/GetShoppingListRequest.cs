using System.ComponentModel.DataAnnotations;

namespace NoshServer.Api.Contracts.ShoppingLists.Requests;

/// <summary>
/// Query parameters for reading the shopping list: what the recipes planned between two dates need.
/// </summary>
public record GetShoppingListRequest : IValidatableObject
{
    /// <summary>
    /// The longest range that can be requested, in days.
    /// </summary>
    public const int MaxRangeDays = 31;

    /// <summary>
    /// The first date of the range, inclusive.
    /// </summary>
    [Required]
    public DateOnly? From { get; init; } = null;

    /// <summary>
    /// The last date of the range, inclusive. At most 31 days after <see cref="From"/>.
    /// </summary>
    [Required]
    public DateOnly? To { get; init; } = null;

    /// <inheritdoc />
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (From is { } from && To is { } to)
        {
            if (to < from)
            {
                yield return new ValidationResult("To can't be before From.", [nameof(To)]);
            }
            else if (to.DayNumber - from.DayNumber >= MaxRangeDays)
            {
                yield return new ValidationResult($"The range can't be longer than {MaxRangeDays} days.", [nameof(To)]);
            }
        }
    }
}
