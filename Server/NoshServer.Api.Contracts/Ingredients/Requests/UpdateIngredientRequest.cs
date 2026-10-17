namespace NoshServer.Api.Contracts.Ingredients.Requests;

/// <summary>
/// Request to update an ingredient.
/// </summary>
/// <param name="Name">The new ingredient name. Must be unique, ignoring case.</param>
public record UpdateIngredientRequest(string Name);
