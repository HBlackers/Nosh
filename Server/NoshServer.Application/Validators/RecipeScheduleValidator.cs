using FluentValidation;
using NoshServer.Application.Models.Schedules;
using NoshServer.Application.Models.Schedules.Enums;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Validators;

/// <summary>
/// Validates <see cref="RecipeSchedule"/> models.
/// </summary>
public class RecipeScheduleValidator : AbstractValidator<RecipeSchedule>
{
    public RecipeScheduleValidator(IRecipeRepository recipeRepository)
    {
        RuleFor(s => s.RecipeId)
            .MustAsync((recipeId, cancellationToken) => recipeRepository.AnyAsync(r => r.Id == recipeId, cancellationToken))
            .WithMessage("The recipe does not exist.");

        RuleFor(s => s.MealType).IsInEnum();
        RuleFor(s => s.Frequency).IsInEnum();

        When(s => s.Frequency != RecurrenceFrequency.None, () =>
        {
            RuleFor(s => s.Interval).GreaterThanOrEqualTo(1);

            RuleFor(s => s.DaysOfWeek)
                .NotEmpty()
                .WithMessage("Choose at least one day of the week.")
                .When(s => s.Frequency == RecurrenceFrequency.Weekly);
            RuleForEach(s => s.DaysOfWeek).IsInEnum();

            RuleFor(s => s.EndDate)
                .GreaterThanOrEqualTo(s => s.StartDate)
                .WithMessage("The end date can't be before the start date.")
                .When(s => s.EndDate is not null);

            RuleFor(s => s.MaxOccurrences)
                .GreaterThanOrEqualTo(1)
                .When(s => s.MaxOccurrences is not null);

            RuleFor(s => s.MaxOccurrences)
                .Null()
                .WithMessage("Give an end date or a number of occurrences, not both.")
                .When(s => s.EndDate is not null);
        });
    }
}
