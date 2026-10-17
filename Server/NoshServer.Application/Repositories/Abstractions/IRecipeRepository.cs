using NoshServer.Application.Models.Recipes;

namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Data access for <see cref="Recipe"/> entities.
/// </summary>
public interface IRecipeRepository : IBaseRepository<Recipe>
{
}
