using NoshServer.Application.Helpers;
using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Inventory;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Models.Recipes.Enums;
using NoshServer.Application.Models.ShoppingLists;
using NoshServer.Application.Models.ShoppingLists.Enums;
using NoshServer.Application.Repositories.Abstractions;
using NoshServer.Application.Services.Abstractions;

namespace NoshServer.Application.Services;

/// <inheritdoc cref="IShoppingListService"/>
public class ShoppingListService(
    IRecipeScheduleRepository scheduleRepository,
    IScheduleEventRepository scheduleEventRepository,
    IRecipeRepository recipeRepository,
    IInventoryItemRepository inventoryItemRepository) : IShoppingListService
{
    /// <inheritdoc />
    public async Task<ShoppingList> GetAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken = default)
    {
        var schedules = await scheduleRepository.GetOverlappingAsync(from, to, cancellationToken);

        // Meals that were completed or skipped no longer need shopping for.
        var handled = (await scheduleEventRepository.GetInRangeAsync(from, to, cancellationToken))
            .Select(e => (e.ScheduleId, e.Date))
            .ToHashSet();

        var timesPlanned = schedules
            .GroupBy(s => s.RecipeId)
            .ToDictionary(g => g.Key, g => g.Sum(s => ScheduleExpander.Expand(s, from, to).Count(date => !handled.Contains((s.Id, date)))))
            .Where(planned => planned.Value > 0)
            .ToDictionary(planned => planned.Key, planned => planned.Value);

        List<Recipe> recipes = timesPlanned.Count == 0
            ? []
            : await recipeRepository.GetByIdsAsync([.. timesPlanned.Keys], cancellationToken);

        var stock = await inventoryItemRepository.GetAllWithIngredientAsync(cancellationToken);
        var stockByIngredient = stock.ToDictionary(i => i.IngredientId);

        var lines = recipes
            .SelectMany(recipe => (recipe.Ingredients ?? []).Select(line => (Recipe: recipe, Line: line, Times: timesPlanned[recipe.Id])))
            .ToList();

        List<ShoppingListItem> items = [];
        foreach (var ingredient in lines.GroupBy(l => l.Line.IngredientId))
        {
            var name = ingredient.First().Line.Ingredient?.Name ?? string.Empty;
            items.AddRange(BuildItems(ingredient.Key, name, ingredient.ToList(), stockByIngredient.GetValueOrDefault(ingredient.Key)));
        }

        var planned = lines.Select(l => l.Line.IngredientId).ToHashSet();

        return new ShoppingList
        {
            From = from,
            To = to,
            Items = [.. items.OrderBy(i => i.IngredientName, StringComparer.OrdinalIgnoreCase)],
            UnplannedStock =
            [
                .. stock
                    .Where(i => !planned.Contains(i.IngredientId))
                    .OrderBy(i => i.Ingredient?.Name, StringComparer.OrdinalIgnoreCase),
            ],
        };
    }

    // One item for each group of units that can be added together. Lines without an amount only make an item when no
    // recipe gives an amount, as an item with an amount already puts the ingredient on the list.
    private static IEnumerable<ShoppingListItem> BuildItems(
        Guid ingredientId,
        string name,
        List<(Recipe Recipe, RecipeIngredient Line, int Times)> lines,
        InventoryItem? inStock)
    {
        List<Need> needs = [];
        List<Recipe> unquantified = [];

        foreach (var (recipe, line, times) in lines)
        {
            if (line.Quantity is not { } amount)
            {
                unquantified.Add(recipe);
                continue;
            }

            var need = needs.Find(n => n.Unit.CanConvertTo(line.Unit));
            if (need is null)
            {
                need = new Need(line.Unit);
                needs.Add(need);
            }

            need.Add(amount * times, line.Unit);
            need.Recipes.Add(recipe);
        }

        if (needs.Count == 0)
        {
            yield return new ShoppingListItem
            {
                IngredientId = ingredientId,
                IngredientName = name,
                InStock = inStock,
                Status = inStock is null ? ShoppingListItemStatus.ToBuy : ShoppingListItemStatus.Covered,
                Recipes = [.. unquantified.DistinctBy(r => r.Id)],
            };

            yield break;
        }

        foreach (var need in needs)
        {
            var needed = new Quantity(need.Amount, need.Unit);
            var (status, toBuy) = Compare(needed, inStock);

            yield return new ShoppingListItem
            {
                IngredientId = ingredientId,
                IngredientName = name,
                Needed = needed,
                InStock = inStock,
                ToBuy = toBuy,
                Status = status,
                Recipes = [.. need.Recipes.DistinctBy(r => r.Id)],
            };
        }
    }

    // Compares in the smaller of the two units so amounts stay whole where possible.
    private static (ShoppingListItemStatus Status, Quantity? ToBuy) Compare(Quantity needed, InventoryItem? inStock)
    {
        if (inStock is null)
        {
            return (ShoppingListItemStatus.ToBuy, needed);
        }

        if (!inStock.Unit.CanConvertTo(needed.Unit))
        {
            return (ShoppingListItemStatus.UnitMismatch, needed);
        }

        var unit = inStock.Unit.Smaller(needed.Unit);
        var shortfall = needed.Unit.Convert(needed.Amount, unit) - inStock.Unit.Convert(inStock.Quantity, unit);

        return shortfall > 0
            ? (ShoppingListItemStatus.ToBuy, new Quantity(shortfall, unit))
            : (ShoppingListItemStatus.Covered, null);
    }

    // A running total for one group of units that can be added together, kept in the smaller unit.
    private sealed class Need(MeasurementUnit? unit)
    {
        public MeasurementUnit? Unit { get; private set; } = unit;

        public decimal Amount { get; private set; }

        public List<Recipe> Recipes { get; } = [];

        public void Add(decimal amount, MeasurementUnit? from)
        {
            var target = Unit.Smaller(from);
            Amount = Unit.Convert(Amount, target) + from.Convert(amount, target);
            Unit = target;
        }
    }
}
