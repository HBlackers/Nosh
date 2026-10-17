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

    public static Ingredient ToModel(this UpdateIngredientRequest request)
    {
        return new Ingredient { Name = request.Name };
    }

    public static IngredientResponse ToResponse(this Ingredient ingredient)
    {
        return new IngredientResponse(ingredient.Id, ingredient.Name);
    }
}
