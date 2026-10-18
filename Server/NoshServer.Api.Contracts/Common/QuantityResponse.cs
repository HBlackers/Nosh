using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Api.Contracts.Common;

/// <summary>
/// An amount and the unit it is measured in.
/// </summary>
/// <param name="Amount">The amount.</param>
/// <param name="Unit">The unit the amount is measured in, or null for a plain count.</param>
public record QuantityResponse(decimal Amount, MeasurementUnit? Unit);
