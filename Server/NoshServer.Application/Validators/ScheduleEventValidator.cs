using FluentValidation;
using NoshServer.Application.Helpers;
using NoshServer.Application.Models.Schedules;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Validators;

/// <summary>
/// Validates <see cref="ScheduleEvent"/> models. A new event is checked against its schedule, so the schedule must be
/// loaded (it is null when the schedule doesn't exist); only the status of an existing event can change.
/// </summary>
public class ScheduleEventValidator : AbstractValidator<ScheduleEvent>
{
    public ScheduleEventValidator(IScheduleEventRepository scheduleEventRepository)
    {
        RuleFor(e => e.Status).IsInEnum();

        When(e => e.Id == Guid.Empty, () =>
        {
            RuleFor(e => e.Schedule)
                .NotNull()
                .WithMessage("The schedule does not exist.")
                .OverridePropertyName(nameof(ScheduleEvent.ScheduleId));

            RuleFor(e => e.Date)
                .Must((scheduleEvent, date) => scheduleEvent.Schedule is { } schedule && ScheduleExpander.Expand(schedule, date, date).Any())
                .WithMessage("The schedule doesn't fall on this date.")
                .When(e => e.Schedule is not null);

            RuleFor(e => e.Date)
                .MustAsync(async (scheduleEvent, date, cancellationToken) =>
                    !await scheduleEventRepository.AnyAsync(e => e.ScheduleId == scheduleEvent.ScheduleId && e.Date == date, cancellationToken))
                .WithMessage("This meal has already been completed or skipped.");
        });
    }
}
