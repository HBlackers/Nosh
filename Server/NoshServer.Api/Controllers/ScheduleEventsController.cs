using Microsoft.AspNetCore.Mvc;
using NoshServer.Api.Contracts.Common;
using NoshServer.Api.Contracts.Schedules.Requests;
using NoshServer.Api.Contracts.Schedules.Responses;
using NoshServer.Api.Mappers;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Api.Controllers;

[ApiController]
[Route("schedule-events")]
public class ScheduleEventsController(IScheduleEventService scheduleEventService) : ControllerBase
{
    /// <summary>
    /// Gets a page of the meals that were completed or skipped, newest date first, optionally only those for one
    /// schedule and/or between two dates.
    /// </summary>
    [HttpGet]
    [ProducesResponseType<PagedResponse<ScheduleEventResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAll([FromQuery] GetScheduleEventsRequest request, CancellationToken cancellationToken)
    {
        var result = await scheduleEventService.GetPagedAsync(request.Page, request.PageSize, request.ScheduleId, request.From, request.To, cancellationToken);

        return Ok(result.ToResponse(ScheduleMappings.ToResponse));
    }

    /// <summary>
    /// Gets a schedule event by its identifier.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<ScheduleEventResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var scheduleEvent = await scheduleEventService.GetByIdAsync(id, cancellationToken);

        return scheduleEvent is null ? NotFound() : Ok(scheduleEvent.ToResponse());
    }

    /// <summary>
    /// Marks one occurrence of a schedule as completed or skipped. Completing it takes the recipe's ingredients out of
    /// stock, as much as there is of each; an ingredient that is used up is removed. Skipping leaves stock as it is.
    /// </summary>
    [HttpPost]
    [ProducesResponseType<ScheduleEventResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(CreateScheduleEventRequest request, CancellationToken cancellationToken)
    {
        var created = await scheduleEventService.CreateAsync(request.ToModel(), cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToResponse());
    }

    /// <summary>
    /// Changes whether an occurrence was completed or skipped. Changing a skipped meal to completed takes its ingredients
    /// out of stock; changing a completed meal to skipped does not put them back.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType<ScheduleEventResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, UpdateScheduleEventRequest request, CancellationToken cancellationToken)
    {
        var scheduleEvent = await scheduleEventService.GetByIdAsync(id, cancellationToken);
        if (scheduleEvent is null)
        {
            return NotFound();
        }

        request.ApplyTo(scheduleEvent);
        var updated = await scheduleEventService.UpdateAsync(scheduleEvent, cancellationToken);

        return Ok(updated.ToResponse());
    }

    /// <summary>
    /// Deletes an event so the occurrence is to come again. Stock that completing it used is not put back.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var scheduleEvent = await scheduleEventService.GetByIdAsync(id, cancellationToken);
        if (scheduleEvent is null)
        {
            return NotFound();
        }

        await scheduleEventService.DeleteAsync(id, cancellationToken);

        return NoContent();
    }
}
