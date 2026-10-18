using FluentValidation;
using NoshServer.Application.Models.Preferences;

namespace NoshServer.Application.Validators;

/// <summary>
/// Validates <see cref="UserPreference"/> models.
/// </summary>
public class UserPreferenceValidator : AbstractValidator<UserPreference>
{
    public UserPreferenceValidator()
    {
        RuleForEach(p => p.Dietary).IsInEnum();
    }
}
