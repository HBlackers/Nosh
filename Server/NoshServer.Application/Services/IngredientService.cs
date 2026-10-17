using FluentValidation;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Ingredients;
using NoshServer.Application.Repositories.Abstractions;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Application.Services;

/// <inheritdoc cref="IIngredientService"/>
public class IngredientService(IIngredientRepository ingredientRepository, IValidator<Ingredient> validator) : IIngredientService
{
    /// <inheritdoc />
    public Task<PagedResult<Ingredient>> GetPagedAsync(int page, int pageSize, string? name, CancellationToken cancellationToken = default)
    {
        return ingredientRepository.SearchAsync(page, pageSize, name, cancellationToken);
    }

    /// <inheritdoc />
    public Task<Ingredient?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return ingredientRepository.GetByIdAsync(id, cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public async Task<Ingredient> CreateAsync(Ingredient ingredient, CancellationToken cancellationToken = default)
    {
        ingredient.Name = ingredient.Name.Trim();
        await validator.ValidateAndThrowAsync(ingredient, cancellationToken);

        return await ingredientRepository.AddAsync(ingredient, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<Ingredient> UpdateAsync(Ingredient ingredient, CancellationToken cancellationToken = default)
    {
        ingredient.Name = ingredient.Name.Trim();
        await validator.ValidateAndThrowAsync(ingredient, cancellationToken);

        return await ingredientRepository.UpdateAsync(ingredient, cancellationToken);
    }

    /// <inheritdoc />
    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await ingredientRepository.DeleteAsync(id, cancellationToken);
    }
}
