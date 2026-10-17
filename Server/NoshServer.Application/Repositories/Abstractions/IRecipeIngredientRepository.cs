using NoshServer.Application.Models.Recipes;

namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Data access for <see cref="RecipeIngredient"/> entities.
/// </summary>
public interface IRecipeIngredientRepository : IBaseRepository<RecipeIngredient>
{
}
