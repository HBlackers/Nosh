using FluentValidation;
using NoshServer.Application.Models.Inventory;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Validators;

/// <summary>
/// Validates <see cref="InventoryItem"/> models.
/// </summary>
public class InventoryItemValidator : AbstractValidator<InventoryItem>
{
    public InventoryItemValidator(IIngredientRepository ingredientRepository)
    {
        RuleFor(i => i.IngredientId)
            .MustAsync((ingredientId, cancellationToken) =>
                ingredientRepository.AnyAsync(i => i.Id == ingredientId, cancellationToken))
            .WithMessage("The ingredient does not exist.");

        RuleFor(i => i.Quantity).GreaterThan(0m);

        RuleFor(i => i.Unit).IsInEnum();
    }
}
