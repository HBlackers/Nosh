namespace NoshServer.Api.Contracts.Ingredients.Responses;

/// <summary>
/// An ingredient.
/// </summary>
/// <param name="Id">The ingredient identifier.</param>
/// <param name="Name">The ingredient name.</param>
public record IngredientResponse(Guid Id, string Name);
