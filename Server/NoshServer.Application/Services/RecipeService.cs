using FluentValidation;
using Microsoft.Extensions.Options;
using NoshServer.Application.Helpers;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Models.Recipes.Sample;
using NoshServer.Application.Options;
using NoshServer.Application.Repositories.Abstractions;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Application.Services;

/// <inheritdoc cref="IRecipeService"/>
public class RecipeService(
    IRecipeRepository recipeRepository,
    IValidator<Recipe> validator,
    IOptions<SampleRecipesOptions> sampleRecipesOptions) : IRecipeService
{
    // Loaded once from configuration through DI and kept in memory; never written to the database.
    private IReadOnlyList<SampleRecipe> SampleRecipes { get; } = sampleRecipesOptions.Value.Recipes;

    /// <inheritdoc />
    public Task<PagedResult<Recipe>> GetPagedAsync(int page, int pageSize, string? name, CancellationToken cancellationToken = default)
    {
        return recipeRepository.SearchAsync(page, pageSize, name, cancellationToken);
    }

    /// <inheritdoc />
    public PagedResult<SampleRecipe> GetSampleRecipes(int page, int pageSize, string? name)
    {
        var matches = string.IsNullOrWhiteSpace(name)
            ? SampleRecipes
            : [.. SampleRecipes.Where(r => r.Name.Contains(name.Trim(), StringComparison.OrdinalIgnoreCase))];

        return new PagedResult<SampleRecipe>
        {
            Items = [.. matches.Skip((page - 1) * pageSize).Take(pageSize)],
            Page = page,
            PageSize = pageSize,
            TotalCount = matches.Count,
        };
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
    public async Task<Recipe> UpdateAsync(Recipe recipe, CancellationToken cancellationToken = default)
    {
        RecipeHelper.Normalise(recipe);
        await validator.ValidateAndThrowAsync(recipe, cancellationToken);

        await recipeRepository.UpdateAsync(recipe, cancellationToken);

        // Reload so the response includes each line's ingredient.
        return (await recipeRepository.GetByIdAsync(recipe.Id, cancellationToken: cancellationToken))!;
    }

    /// <inheritdoc />
    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await recipeRepository.DeleteAsync(id, cancellationToken);
    }
}
