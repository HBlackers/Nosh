using NoshServer.Application.Context;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Repositories;

/// <inheritdoc cref="IRecipeRepository"/>
public class RecipeRepository(NoshContext context) : BaseRepository<Recipe>(context), IRecipeRepository
{
}
