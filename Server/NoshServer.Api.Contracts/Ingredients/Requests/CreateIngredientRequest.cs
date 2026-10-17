namespace NoshServer.Api.Contracts.Ingredients.Requests;

/// <summary>
/// Request to create an ingredient.
/// </summary>
/// <param name="Name">The ingredient name. Must be unique, ignoring case.</param>
public record CreateIngredientRequest(string Name);
