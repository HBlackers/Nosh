using Microsoft.AspNetCore.Mvc;
using NoshServer.Api.Contracts.Common;
using NoshServer.Api.Contracts.Preferences.Requests;
using NoshServer.Api.Contracts.Preferences.Responses;
using NoshServer.Api.Mappers;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Api.Controllers;

[ApiController]
[Route("preferences")]
public class UserPreferencesController(IUserPreferenceService preferenceService) : ControllerBase
{
    /// <summary>
    /// Gets a page of preferences, oldest first.
    /// </summary>
    [HttpGet]
    [ProducesResponseType<PagedResponse<UserPreferenceResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAll([FromQuery] PagedRequest request, CancellationToken cancellationToken)
    {
        var result = await preferenceService.GetPagedAsync(request.Page, request.PageSize, cancellationToken);

        return Ok(result.ToResponse(UserPreferenceMappings.ToResponse));
    }

    /// <summary>
    /// Gets a preference by its identifier.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<UserPreferenceResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var preference = await preferenceService.GetByIdAsync(id, cancellationToken);

        return preference is null ? NotFound() : Ok(preference.ToResponse());
    }

    /// <summary>
    /// Creates a set of preferences. There is no limit on how many can exist.
    /// </summary>
    [HttpPost]
    [ProducesResponseType<UserPreferenceResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(CreateUserPreferenceRequest request, CancellationToken cancellationToken)
    {
        var preference = await preferenceService.CreateAsync(request.ToModel(), cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = preference.Id }, preference.ToResponse());
    }

    /// <summary>
    /// Replaces a set of preferences.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType<UserPreferenceResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, UpdateUserPreferenceRequest request, CancellationToken cancellationToken)
    {
        var preference = await preferenceService.GetByIdAsync(id, cancellationToken);
        if (preference is null)
        {
            return NotFound();
        }

        request.ApplyTo(preference);
        var updated = await preferenceService.UpdateAsync(preference, cancellationToken);

        return Ok(updated.ToResponse());
    }

    /// <summary>
    /// Deletes a set of preferences.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var preference = await preferenceService.GetByIdAsync(id, cancellationToken);
        if (preference is null)
        {
            return NotFound();
        }

        await preferenceService.DeleteAsync(id, cancellationToken);

        return NoContent();
    }
}
