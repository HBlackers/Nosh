using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Schedules;

namespace NoshServer.Application.Services.Abstractions;

/// <summary>
/// Business logic for the recipe schedule.
/// </summary>
public interface IRecipeScheduleService
{
    /// <summary>
    /// Gets one page of the occurrences that fall between the two dates (inclusive), ordered by date then meal.
    /// Repeating schedules are expanded into one occurrence per date.
    /// </summary>
    Task<PagedResult<ScheduleOccurrence>> GetOccurrencesAsync(
        DateOnly from,
        DateOnly to,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets one page of a recipe's schedules, ordered by start date.
    /// </summary>
    Task<PagedResult<RecipeSchedule>> GetByRecipeAsync(Guid recipeId, int page, int pageSize, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a schedule with its recipe, or null if it does not exist.
    /// </summary>
    Task<RecipeSchedule?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a schedule. Throws a validation exception if it is invalid.
    /// </summary>
    Task<RecipeSchedule> CreateAsync(RecipeSchedule schedule, CancellationToken cancellationToken = default);

    /// <summary>
    /// Saves a schedule that has already been loaded and updated by the caller.
    /// Throws a validation exception if it is invalid.
    /// </summary>
    Task<RecipeSchedule> UpdateAsync(RecipeSchedule schedule, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a schedule. The caller is expected to have checked that it exists.
    /// </summary>
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
