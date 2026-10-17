using NoshServer.Api.Contracts.Ingredients.Requests;
using NoshServer.Api.Contracts.Ingredients.Responses;
using NoshServer.Application.Models.Ingredients;

namespace NoshServer.Api.Mappers;

public static class IngredientMappings
{
    public static Ingredient ToModel(this CreateIngredientRequest request)
    {
        return new Ingredient { Name = request.Name };
    }

    /// <summary>
    /// Applies the request to an existing ingredient. Its id and timestamps are left as they are.
    /// </summary>
    public static void ApplyTo(this UpdateIngredientRequest request, Ingredient ingredient)
    {
        ingredient.Name = request.Name;
    }

    public static IngredientResponse ToResponse(this Ingredient ingredient)
    {
        return new IngredientResponse(ingredient.Id, ingredient.Name);
    }
}
