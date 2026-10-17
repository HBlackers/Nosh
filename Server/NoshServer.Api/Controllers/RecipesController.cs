using Microsoft.AspNetCore.Mvc;
using NoshServer.Api.Contracts.Common;
using NoshServer.Api.Contracts.Recipes.Requests;
using NoshServer.Api.Contracts.Recipes.Responses;
using NoshServer.Api.Contracts.Recipes.Sample.Responses;
using NoshServer.Api.Mappers;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Api.Controllers;

[ApiController]
[Route("recipes")]
public class RecipesController(IRecipeService recipeService) : ControllerBase
{
    /// <summary>
    /// Gets a page of recipes (without method or ingredient lines) ordered by name, optionally filtered by name and dietary requirements.
    /// </summary>
    [HttpGet]
    [ProducesResponseType<PagedResponse<RecipeSummaryResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAll([FromQuery] GetRecipesRequest request, CancellationToken cancellationToken)
    {
        var result = await recipeService.GetPagedAsync(request.Page, request.PageSize, request.Name, request.Dietary, cancellationToken);

        return Ok(result.ToResponse(RecipeMappings.ToSummaryResponse));
    }

    /// <summary>
    /// Gets a page of the sample recipes supplied from configuration, optionally filtered by name and dietary requirements.
    /// These are not stored in the database.
    /// </summary>
    [HttpGet("samples")]
    [ProducesResponseType<PagedResponse<SampleRecipeResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public IActionResult GetSamples([FromQuery] GetRecipesRequest request)
    {
        var result = recipeService.GetSampleRecipes(request.Page, request.PageSize, request.Name, request.Dietary);

        return Ok(result.ToResponse(RecipeMappings.ToResponse));
    }

    /// <summary>
    /// Gets a recipe, including its method and ingredient lines.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<RecipeResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var recipe = await recipeService.GetByIdAsync(id, cancellationToken);

        return recipe is null ? NotFound() : Ok(recipe.ToResponse());
    }

    /// <summary>
    /// Creates a recipe together with its ingredient lines.
    /// </summary>
    [HttpPost]
    [ProducesResponseType<RecipeResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(CreateRecipeRequest request, CancellationToken cancellationToken)
    {
        var recipe = await recipeService.CreateAsync(request.ToModel(), cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, recipe.ToResponse());
    }

    /// <summary>
    /// Replaces a recipe's details and ingredient lines.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType<RecipeResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, UpdateRecipeRequest request, CancellationToken cancellationToken)
    {
        var recipe = await recipeService.GetByIdAsync(id, cancellationToken);
        if (recipe is null)
        {
            return NotFound();
        }

        request.ApplyTo(recipe);
        var updated = await recipeService.UpdateAsync(recipe, cancellationToken);

        return Ok(updated.ToResponse());
    }

    /// <summary>
    /// Deletes a recipe and its ingredient lines.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var recipe = await recipeService.GetByIdAsync(id, cancellationToken);
        if (recipe is null)
        {
            return NotFound();
        }

        await recipeService.DeleteAsync(id, cancellationToken);

        return NoContent();
    }
}
