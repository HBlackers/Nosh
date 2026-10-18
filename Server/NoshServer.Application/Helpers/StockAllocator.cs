using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Inventory;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Models.Recipes.Enums;
using NoshServer.Application.Models.Schedules;
using NoshServer.Application.Models.Schedules.Enums;

namespace NoshServer.Application.Helpers;

/// <summary>
/// Hands out a copy of the stock to meals one at a time, so each meal sees only what the meals before it left.
/// The stored inventory is never changed; <see cref="GetChanges"/> says what a caller would need to save.
/// </summary>
public class StockAllocator
{
    private readonly Dictionary<Guid, InventoryItem> _items;
    private readonly Dictionary<Guid, Quantity> _remaining;

    public StockAllocator(IEnumerable<InventoryItem> stock)
    {
        _items = stock.ToDictionary(i => i.IngredientId);
        _remaining = _items.ToDictionary(i => i.Key, i => new Quantity(i.Value.Quantity, i.Value.Unit));
    }

    /// <summary>
    /// Takes the recipe's ingredients out of the remaining stock, as much as there is of each, and says how well the
    /// stock covered them. Lines without an amount are covered by any stock of the ingredient and take none of it.
    /// </summary>
    public MealAvailability Take(Recipe recipe)
    {
        List<LackingIngredient> lacking = [];
        var total = 0;
        var covered = 0;
        var anyStock = false;

        foreach (var line in recipe.Ingredients ?? [])
        {
            total++;
            var name = line.Ingredient?.Name ?? string.Empty;
            var have = _remaining.GetValueOrDefault(line.IngredientId);
            var hasStock = have is { Amount: > 0 };

            if (line.Quantity is not { } amount)
            {
                if (hasStock)
                {
                    covered++;
                    anyStock = true;
                }
                else
                {
                    lacking.Add(new LackingIngredient(line.IngredientId, name, null, null));
                }

                continue;
            }

            var needed = new Quantity(amount, line.Unit);

            if (!hasStock)
            {
                lacking.Add(new LackingIngredient(line.IngredientId, name, needed, null));
                continue;
            }

            if (!have!.Unit.CanConvertTo(needed.Unit))
            {
                lacking.Add(new LackingIngredient(line.IngredientId, name, needed, have));
                continue;
            }

            anyStock = true;

            var unit = have.Unit.Smaller(needed.Unit);
            var available = have.Unit.Convert(have.Amount, unit);
            var required = needed.Unit.Convert(needed.Amount, unit);
            _remaining[line.IngredientId] = new Quantity(Math.Max(available - required, 0m), unit);

            if (available >= required)
            {
                covered++;
            }
            else
            {
                lacking.Add(new LackingIngredient(line.IngredientId, name, needed, new Quantity(available, unit)));
            }
        }

        var status = covered == total
            ? MealAvailabilityStatus.Ready
            : anyStock ? MealAvailabilityStatus.Partial : MealAvailabilityStatus.Missing;

        return new MealAvailability(status, total, covered, lacking);
    }

    /// <summary>
    /// Gets the inventory items whose stock has been taken from, with what is left of each. A remaining amount of zero
    /// means the item is used up.
    /// </summary>
    public IEnumerable<(InventoryItem Item, Quantity Remaining)> GetChanges()
    {
        foreach (var (ingredientId, item) in _items)
        {
            var remaining = _remaining[ingredientId];
            if (remaining.Amount != item.Quantity || remaining.Unit != item.Unit)
            {
                yield return (item, remaining);
            }
        }
    }
}
