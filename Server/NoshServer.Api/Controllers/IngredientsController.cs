using Microsoft.AspNetCore.Mvc;
using NoshServer.Api.Contracts.Common;
using NoshServer.Api.Contracts.Ingredients.Requests;
using NoshServer.Api.Contracts.Ingredients.Responses;
using NoshServer.Api.Mappers;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class IngredientsController(IIngredientService ingredientService) : ControllerBase
{
    /// <summary>
    /// Gets a page of ingredients ordered by name, optionally filtered by name.
    /// </summary>
    [HttpGet]
    [ProducesResponseType<PagedResponse<IngredientResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAll([FromQuery] GetIngredientsRequest request, CancellationToken cancellationToken)
    {
        var result = await ingredientService.GetPagedAsync(request.Page, request.PageSize, request.Name, cancellationToken);

        return Ok(result.ToResponse(IngredientMappings.ToResponse));
    }

    /// <summary>
    /// Gets an ingredient by its identifier.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<IngredientResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var ingredient = await ingredientService.GetByIdAsync(id, cancellationToken);

        return ingredient is null ? NotFound() : Ok(ingredient.ToResponse());
    }

    /// <summary>
    /// Creates an ingredient.
    /// </summary>
    [HttpPost]
    [ProducesResponseType<IngredientResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(CreateIngredientRequest request, CancellationToken cancellationToken)
    {
        var ingredient = await ingredientService.CreateAsync(request.ToModel(), cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = ingredient.Id }, ingredient.ToResponse());
    }

    /// <summary>
    /// Updates an ingredient.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType<IngredientResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, UpdateIngredientRequest request, CancellationToken cancellationToken)
    {
        var ingredient = await ingredientService.UpdateAsync(id, request.ToModel(), cancellationToken);

        return ingredient is null ? NotFound() : Ok(ingredient.ToResponse());
    }

    /// <summary>
    /// Deletes an ingredient.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await ingredientService.DeleteAsync(id, cancellationToken);

        return deleted ? NoContent() : NotFound();
    }
}
