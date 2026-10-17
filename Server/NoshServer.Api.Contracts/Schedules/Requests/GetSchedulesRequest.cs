using System.ComponentModel.DataAnnotations;
using NoshServer.Api.Contracts.Common;

namespace NoshServer.Api.Contracts.Schedules.Requests;

/// <summary>
/// Query parameters for reading the calendar: the occurrences between two dates, paged.
/// </summary>
public record GetSchedulesRequest : PagedRequest, IValidatableObject
{
    /// <summary>
    /// The longest range that can be requested, in days.
    /// </summary>
    public const int MaxRangeDays = 366;

    /// <summary>
    /// The first date of the range, inclusive.
    /// </summary>
    [Required]
    public DateOnly? From { get; init; } = null;

    /// <summary>
    /// The last date of the range, inclusive. At most 366 days after <see cref="From"/>.
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
