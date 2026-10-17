using NoshServer.Application.Context;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Repositories;

/// <inheritdoc cref="IRecipeIngredientRepository"/>
public class RecipeIngredientRepository(NoshContext context) : BaseRepository<RecipeIngredient>(context), IRecipeIngredientRepository
{
}
