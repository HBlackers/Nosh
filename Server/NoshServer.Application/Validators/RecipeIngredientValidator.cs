using FluentValidation;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Validators;

/// <summary>
/// Validates a single <see cref="RecipeIngredient"/> line. Used by <see cref="RecipeValidator"/> for each line of a recipe.
/// </summary>
public class RecipeIngredientValidator : AbstractValidator<RecipeIngredient>
{
    public RecipeIngredientValidator(
        IIngredientRepository ingredientRepository,
        IRecipeIngredientRepository recipeIngredientRepository)
    {
        RuleFor(l => l.IngredientId)
            .MustAsync((ingredientId, cancellationToken) =>
                ingredientRepository.AnyAsync(i => i.Id == ingredientId, cancellationToken))
            .WithMessage("The ingredient does not exist.");

        RuleFor(l => l.Quantity).GreaterThan(0m);

        RuleFor(l => l.Unit).IsInEnum();

        RuleFor(l => l.Unit)
            .Null()
            .When(l => l.Quantity is null)
            .WithMessage("A unit needs a quantity.");

        RuleFor(l => l.Prep).MaximumLength(200);

        // An existing line can only be edited through the recipe it belongs to.
        RuleFor(l => l.Id)
            .MustAsync((line, id, cancellationToken) =>
                recipeIngredientRepository.AnyAsync(l => l.Id == id && l.RecipeId == line.RecipeId, cancellationToken))
            .When(l => l.Id != Guid.Empty)
            .WithMessage("The ingredient line does not belong to this recipe.");
    }
}
