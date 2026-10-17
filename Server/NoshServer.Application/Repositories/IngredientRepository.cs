using NoshServer.Application.Context;
using NoshServer.Application.Models.Ingredients;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Repositories;

/// <inheritdoc cref="IIngredientRepository"/>
public class IngredientRepository(NoshContext context) : BaseRepository<Ingredient>(context), IIngredientRepository
{
}
