using FluentValidation;
using NoshServer.Application.Helpers;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Repositories.Abstractions;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Application.Services;

/// <inheritdoc cref="IRecipeService"/>
public class RecipeService(IRecipeRepository recipeRepository, IValidator<Recipe> validator) : IRecipeService
{
    /// <inheritdoc />
    public Task<PagedResult<Recipe>> GetPagedAsync(int page, int pageSize, string? name, CancellationToken cancellationToken = default)
    {
        return recipeRepository.SearchAsync(page, pageSize, name, cancellationToken);
    }

    /// <inheritdoc />
    public Task<Recipe?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return recipeRepository.GetByIdAsync(id, cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public async Task<Recipe> CreateAsync(Recipe recipe, CancellationToken cancellationToken = default)
    {
        RecipeHelper.Normalise(recipe);
        recipe.Slug = RecipeHelper.Slugify(recipe.Name);

        foreach (var line in recipe.Ingredients!)
        {
            line.Id = Guid.Empty;
        }

        await validator.ValidateAndThrowAsync(recipe, cancellationToken);

        var created = await recipeRepository.AddAsync(recipe, cancellationToken);

        // Reload so the response includes each line's ingredient.
        return (await recipeRepository.GetByIdAsync(created.Id, cancellationToken: cancellationToken))!;
    }

    /// <inheritdoc />
    public async Task<Recipe?> UpdateAsync(Guid id, Recipe changes, CancellationToken cancellationToken = default)
    {
        var existing = await recipeRepository.GetByIdAsync(id, cancellationToken: cancellationToken);
        if (existing is null)
        {
            return null;
        }

        changes.Id = existing.Id;
        changes.Slug = existing.Slug;
        changes.CreatedAt = existing.CreatedAt;

        RecipeHelper.Normalise(changes);

        foreach (var line in changes.Ingredients!)
        {
            line.RecipeId = existing.Id;
        }

        await validator.ValidateAndThrowAsync(changes, cancellationToken);

        await recipeRepository.UpdateAsync(changes, cancellationToken);

        return await recipeRepository.GetByIdAsync(id, cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return recipeRepository.DeleteAsync(id, cancellationToken);
    }
}
