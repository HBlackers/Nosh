using FluentValidation;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Validators;

/// <summary>
/// Validates <see cref="Recipe"/> models. Ingredient lines are validated by <see cref="RecipeIngredientValidator"/>.
/// </summary>
public class RecipeValidator : AbstractValidator<Recipe>
{
    public RecipeValidator(IRecipeRepository recipeRepository, IValidator<RecipeIngredient> ingredientValidator)
    {
        RuleFor(r => r.Name).NotEmpty().MaximumLength(200);

        // The slug is derived from the name, so slug problems are reported against the name.
        RuleFor(r => r.Slug)
            .NotEmpty()
            .WithMessage("The name must contain at least one letter or number.")
            .OverridePropertyName(nameof(Recipe.Name));

        RuleFor(r => r.Slug)
            .MustAsync(async (recipe, slug, cancellationToken) =>
                !await recipeRepository.ExistsBySlugAsync(slug, recipe.Id == Guid.Empty ? null : recipe.Id, cancellationToken))
            .When(r => !string.IsNullOrEmpty(r.Slug))
            .WithMessage("A recipe with this name already exists.")
            .OverridePropertyName(nameof(Recipe.Name));

        RuleFor(r => r.Serves).GreaterThan(0);

        RuleFor(r => r.Cuisine).IsInEnum();

        RuleFor(r => r.MealTypes).NotEmpty();
        RuleForEach(r => r.MealTypes).IsInEnum();
        RuleForEach(r => r.Dietary).IsInEnum();
        RuleForEach(r => r.Tags).IsInEnum();

        RuleFor(r => r.Method).NotEmpty();
        RuleForEach(r => r.Method).NotEmpty();

        RuleFor(r => r.Ingredients).NotEmpty();
        RuleForEach(r => r.Ingredients).SetValidator(ingredientValidator);
    }
}
