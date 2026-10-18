using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using NoshServer.Application.Context;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Schedules;
using NoshServer.Application.Models.Schedules.Enums;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Repositories;

/// <inheritdoc cref="IRecipeScheduleRepository"/>
public class RecipeScheduleRepository(NoshContext context) : BaseRepository<RecipeSchedule>(context), IRecipeScheduleRepository
{
    private static readonly Func<IQueryable<RecipeSchedule>, IQueryable<RecipeSchedule>> WithRecipe = query => query
        .Include(s => s.Recipe);

    /// <inheritdoc />
    public Task<List<RecipeSchedule>> GetOverlappingAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken = default)
    {
        // A one-off must start inside the range; a repeating schedule must have started by the end of the range and not
        // have ended before its start.
        return GetAllAsync(
            s => s.StartDate <= to
                 && ((s.Frequency == RecurrenceFrequency.None && s.StartDate >= from)
                     || (s.Frequency != RecurrenceFrequency.None && (s.EndDate == null || s.EndDate >= from))),
            WithRecipe,
            cancellationToken);
    }

    /// <inheritdoc />
    public Task<PagedResult<RecipeSchedule>> GetByRecipeAsync(Guid recipeId, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        return GetPagedAsync(
            page,
            pageSize,
            s => s.RecipeId == recipeId,
            query => query.OrderBy(s => s.StartDate).ThenBy(s => s.Id),
            WithRecipe,
            cancellationToken);
    }

    /// <inheritdoc />
    public override Task<RecipeSchedule?> GetByIdAsync(
        Guid id,
        Expression<Func<RecipeSchedule, bool>>? filter = null,
        Func<IQueryable<RecipeSchedule>, IQueryable<RecipeSchedule>>? include = null,
        CancellationToken cancellationToken = default)
    {
        return base.GetByIdAsync(id, filter, include ?? WithRecipe, cancellationToken);
    }
}
