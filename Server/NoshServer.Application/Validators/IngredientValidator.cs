using FluentValidation;
using NoshServer.Application.Models.Ingredients;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Validators;

/// <summary>
/// Validates <see cref="Ingredient"/> models.
/// </summary>
public class IngredientValidator : AbstractValidator<Ingredient>
{
    public IngredientValidator(IIngredientRepository ingredientRepository)
    {
        RuleFor(i => i.Name)
            .NotEmpty()
            .MaximumLength(200)
            .MustAsync(async (ingredient, name, cancellationToken) =>
                !await ingredientRepository.ExistsByNameAsync(
                    name,
                    ingredient.Id == Guid.Empty ? null : ingredient.Id,
                    cancellationToken))
            .WithMessage("An ingredient with this name already exists.");
    }
}
