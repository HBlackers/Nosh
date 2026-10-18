using Microsoft.AspNetCore.Mvc;
using NoshServer.Api.Contracts.Common;
using NoshServer.Api.Contracts.Inventory.Requests;
using NoshServer.Api.Contracts.Inventory.Responses;
using NoshServer.Api.Mappers;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Api.Controllers;

[ApiController]
[Route("inventory")]
public class InventoryController(IInventoryService inventoryService) : ControllerBase
{
    /// <summary>
    /// Gets a page of the ingredients in stock ordered by name, optionally filtered by name.
    /// </summary>
    [HttpGet]
    [ProducesResponseType<PagedResponse<InventoryItemResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAll([FromQuery] GetInventoryRequest request, CancellationToken cancellationToken)
    {
        var result = await inventoryService.GetPagedAsync(request.Page, request.PageSize, request.Name, cancellationToken);

        return Ok(result.ToResponse(InventoryMappings.ToResponse));
    }

    /// <summary>
    /// Gets an inventory item by its identifier.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<InventoryItemResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await inventoryService.GetByIdAsync(id, cancellationToken);

        return item is null ? NotFound() : Ok(item.ToResponse());
    }

    /// <summary>
    /// Adds stock of an ingredient, merging it into the existing item if the ingredient is already in stock.
    /// </summary>
    [HttpPost]
    [ProducesResponseType<InventoryItemResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddStock(AddStockRequest request, CancellationToken cancellationToken)
    {
        var item = await inventoryService.AddStockAsync(request.IngredientId, request.Quantity, request.Unit, cancellationToken);

        return Ok(item.ToResponse());
    }

    /// <summary>
    /// Sets how much of an ingredient is in stock.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType<InventoryItemResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, UpdateInventoryItemRequest request, CancellationToken cancellationToken)
    {
        var item = await inventoryService.GetByIdAsync(id, cancellationToken);
        if (item is null)
        {
            return NotFound();
        }

        request.ApplyTo(item);
        var updated = await inventoryService.UpdateAsync(item, cancellationToken);

        return Ok(updated.ToResponse());
    }

    /// <summary>
    /// Removes an ingredient from stock.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var item = await inventoryService.GetByIdAsync(id, cancellationToken);
        if (item is null)
        {
            return NotFound();
        }

        await inventoryService.DeleteAsync(id, cancellationToken);

        return NoContent();
    }
}
