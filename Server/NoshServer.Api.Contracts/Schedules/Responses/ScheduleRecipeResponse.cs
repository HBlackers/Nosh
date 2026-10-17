namespace NoshServer.Api.Contracts.Schedules.Responses;

/// <summary>
/// The scheduled recipe, with just enough to show it on a calendar. Fetch the recipe by id for its full details.
/// </summary>
/// <param name="Id">The recipe identifier.</param>
/// <param name="Name">The recipe name.</param>
/// <param name="Slug">The URL-friendly unique name.</param>
public record ScheduleRecipeResponse(Guid Id, string Name, string Slug);
