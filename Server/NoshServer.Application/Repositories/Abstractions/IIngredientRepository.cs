using NoshServer.Application.Models.Ingredients;

namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Data access for <see cref="Ingredient"/> entities.
/// </summary>
public interface IIngredientRepository : IBaseRepository<Ingredient>
{
}
