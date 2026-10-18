using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Ingredients;
using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Application.Models.Inventory;

/// <summary>
/// How much of an ingredient is in stock. There is at most one item per ingredient.
/// </summary>
public class InventoryItem : BaseEntity
{
    /// <summary>
    /// Identifier of the ingredient in stock.
    /// </summary>
    public Guid IngredientId { get; set; }

    /// <summary>
    /// Amount in stock.
    /// </summary>
    public decimal Quantity { get; set; }

    /// <summary>
    /// Unit the quantity is measured in, or null for a plain count (for example "4 sausages").
    /// </summary>
    public MeasurementUnit? Unit { get; set; } = null;

    /// <summary>
    /// The ingredient in stock. Null unless loaded with Include.
    /// </summary>
    public virtual Ingredient? Ingredient { get; set; } = null;
}
