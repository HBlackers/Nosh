using NoshServer.Application.Models.Schedules;

namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Data access for <see cref="RecipeSchedule"/> entities. Schedules are read together with their recipe.
/// </summary>
public interface IRecipeScheduleRepository : IBaseRepository<RecipeSchedule>
{
    /// <summary>
    /// Gets the schedules that could have an occurrence between the two dates (inclusive), with their recipe.
    /// </summary>
    Task<List<RecipeSchedule>> GetOverlappingAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken = default);
}
