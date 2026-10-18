using Microsoft.AspNetCore.Mvc;
using NoshServer.Api.Contracts.Common;
using NoshServer.Api.Contracts.Schedules.Requests;
using NoshServer.Api.Contracts.Schedules.Responses;
using NoshServer.Api.Mappers;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Api.Controllers;

[ApiController]
[Route("schedules")]
public class SchedulesController(IRecipeScheduleService scheduleService) : ControllerBase
{
    /// <summary>
    /// Gets a page of the calendar: every date a schedule falls on between two dates, ordered by date then meal.
    /// Repeating schedules are expanded, so a weekly recipe appears once for each week in the range.
    /// </summary>
    [HttpGet]
    [ProducesResponseType<PagedResponse<ScheduleOccurrenceResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAll([FromQuery] GetSchedulesRequest request, CancellationToken cancellationToken)
    {
        var result = await scheduleService.GetOccurrencesAsync(
            request.From!.Value,
            request.To!.Value,
            request.Page,
            request.PageSize,
            cancellationToken);

        return Ok(result.ToResponse(ScheduleMappings.ToResponse));
    }

    /// <summary>
    /// Gets a page of a recipe's schedules, oldest start date first, including their recurrence rules. Includes schedules
    /// that have ended.
    /// </summary>
    [HttpGet("~/recipes/{recipeId:guid}/schedules")]
    [ProducesResponseType<PagedResponse<ScheduleResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetByRecipe(Guid recipeId, [FromQuery] PagedRequest request, CancellationToken cancellationToken)
    {
        var result = await scheduleService.GetByRecipeAsync(recipeId, request.Page, request.PageSize, cancellationToken);

        return Ok(result.ToResponse(schedule => schedule.ToResponse()));
    }

    /// <summary>
    /// Gets a schedule, including its recurrence rule.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<ScheduleResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var schedule = await scheduleService.GetByIdAsync(id, cancellationToken);

        return schedule is null ? NotFound() : Ok(schedule.ToResponse());
    }

    /// <summary>
    /// Schedules a recipe, once or repeating.
    /// </summary>
    [HttpPost]
    [ProducesResponseType<ScheduleResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(CreateScheduleRequest request, CancellationToken cancellationToken)
    {
        var schedule = await scheduleService.CreateAsync(request.ToModel(), cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = schedule.Id }, schedule.ToResponse());
    }

    /// <summary>
    /// Changes a schedule. The change applies to every occurrence.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType<ScheduleResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, UpdateScheduleRequest request, CancellationToken cancellationToken)
    {
        var schedule = await scheduleService.GetByIdAsync(id, cancellationToken);
        if (schedule is null)
        {
            return NotFound();
        }

        request.ApplyTo(schedule);
        var updated = await scheduleService.UpdateAsync(schedule, cancellationToken);

        return Ok(updated.ToResponse());
    }

    /// <summary>
    /// Deletes a schedule, removing every occurrence from the calendar.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var schedule = await scheduleService.GetByIdAsync(id, cancellationToken);
        if (schedule is null)
        {
            return NotFound();
        }

        await scheduleService.DeleteAsync(id, cancellationToken);

        return NoContent();
    }
}
