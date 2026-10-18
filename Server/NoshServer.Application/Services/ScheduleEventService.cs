using FluentValidation;
using NoshServer.Application.Helpers;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Schedules;
using NoshServer.Application.Models.Schedules.Enums;
using NoshServer.Application.Repositories.Abstractions;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Application.Services;

/// <inheritdoc cref="IScheduleEventService"/>
public class ScheduleEventService(
    IScheduleEventRepository scheduleEventRepository,
    IRecipeScheduleRepository scheduleRepository,
    IRecipeRepository recipeRepository,
    IInventoryItemRepository inventoryItemRepository,
    IUnitOfWork unitOfWork,
    IValidator<ScheduleEvent> validator) : IScheduleEventService
{
    /// <inheritdoc />
    public Task<PagedResult<ScheduleEvent>> GetPagedAsync(
        int page,
        int pageSize,
        Guid? scheduleId,
        DateOnly? from,
        DateOnly? to,
        CancellationToken cancellationToken = default)
    {
        return scheduleEventRepository.SearchAsync(page, pageSize, scheduleId, from, to, cancellationToken);
    }

    /// <inheritdoc />
    public Task<ScheduleEvent?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return scheduleEventRepository.GetByIdAsync(id, cancellationToken: cancellationToken);
    }

    /// <inheritdoc />
    public async Task<ScheduleEvent> CreateAsync(ScheduleEvent scheduleEvent, CancellationToken cancellationToken = default)
    {
        var schedule = await scheduleRepository.GetByIdAsync(scheduleEvent.ScheduleId, cancellationToken: cancellationToken);

        scheduleEvent.Schedule = schedule;
        await validator.ValidateAndThrowAsync(scheduleEvent, cancellationToken);
        scheduleEvent.Schedule = null;

        return await SaveAsync(scheduleEvent, schedule!.RecipeId, () => scheduleEventRepository.AddAsync(scheduleEvent, cancellationToken), cancellationToken);
    }

    /// <inheritdoc />
    public async Task<ScheduleEvent> UpdateAsync(ScheduleEvent scheduleEvent, CancellationToken cancellationToken = default)
    {
        await validator.ValidateAndThrowAsync(scheduleEvent, cancellationToken);

        // The caller has already changed the status, so what it was is read again from the database.
        var previous = await scheduleEventRepository.GetByIdAsync(scheduleEvent.Id, cancellationToken: cancellationToken);
        var schedule = await scheduleRepository.GetByIdAsync(scheduleEvent.ScheduleId, cancellationToken: cancellationToken);

        if (previous?.Status == ScheduleEventStatus.Completed || schedule is null)
        {
            return await scheduleEventRepository.UpdateAsync(scheduleEvent, cancellationToken);
        }

        return await SaveAsync(scheduleEvent, schedule.RecipeId, () => scheduleEventRepository.UpdateAsync(scheduleEvent, cancellationToken), cancellationToken);
    }

    /// <inheritdoc />
    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await scheduleEventRepository.DeleteAsync(id, cancellationToken);
    }

    // Saves the event. When it is completed, the recipe's ingredients come out of stock in the same transaction.
    private async Task<ScheduleEvent> SaveAsync(
        ScheduleEvent scheduleEvent,
        Guid recipeId,
        Func<Task<ScheduleEvent>> save,
        CancellationToken cancellationToken)
    {
        if (scheduleEvent.Status != ScheduleEventStatus.Completed)
        {
            return await save();
        }

        var recipe = await recipeRepository.GetByIdAsync(recipeId, cancellationToken: cancellationToken);
        var allocator = new StockAllocator(await inventoryItemRepository.GetAllWithIngredientAsync(cancellationToken));
        if (recipe is not null)
        {
            allocator.Take(recipe);
        }

        var saved = scheduleEvent;
        await unitOfWork.ExecuteAsync(
            async () =>
            {
                // The event goes first so a meal that was already marked fails before any stock is touched.
                saved = await save();

                foreach (var (item, remaining) in allocator.GetChanges())
                {
                    if (remaining.Amount <= 0)
                    {
                        await inventoryItemRepository.DeleteAsync(item.Id, cancellationToken);
                        continue;
                    }

                    item.Quantity = remaining.Amount;
                    item.Unit = remaining.Unit;
                    item.Ingredient = null;
                    await inventoryItemRepository.UpdateAsync(item, cancellationToken);
                }
            },
            cancellationToken);

        return saved;
    }
}
