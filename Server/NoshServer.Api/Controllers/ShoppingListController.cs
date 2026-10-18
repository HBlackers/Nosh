using Microsoft.AspNetCore.Mvc;
using NoshServer.Api.Contracts.ShoppingLists.Requests;
using NoshServer.Api.Contracts.ShoppingLists.Responses;
using NoshServer.Api.Mappers;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Api.Controllers;

[ApiController]
[Route("shopping-list")]
public class ShoppingListController(IShoppingListService shoppingListService) : ControllerBase
{
    /// <summary>
    /// Gets what the recipes planned between two dates need, compared with what is in stock. Repeating schedules count
    /// once for each date they fall on, and amounts in units that can be converted are added together. Each item says
    /// how much is still to buy, and the ingredients in stock that no planned recipe uses are listed separately.
    /// </summary>
    [HttpGet]
    [ProducesResponseType<ShoppingListResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Get([FromQuery] GetShoppingListRequest request, CancellationToken cancellationToken)
    {
        var list = await shoppingListService.GetAsync(request.From!.Value, request.To!.Value, cancellationToken);

        return Ok(list.ToResponse());
    }
}
