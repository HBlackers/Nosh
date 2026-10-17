using System.Text.RegularExpressions;
using NoshServer.Application.Models.Recipes;

namespace NoshServer.Application.Helpers;

/// <summary>
/// Shared helpers for preparing <see cref="Recipe"/> data, used wherever recipes are created or changed.
/// </summary>
public static partial class RecipeHelper
{
    /// <summary>
    /// Trims text and gives each ingredient line its position in the list.
    /// </summary>
    public static void Normalise(Recipe recipe)
    {
        recipe.Name = recipe.Name.Trim();
        recipe.Method = [.. recipe.Method.Select(step => step.Trim())];
        recipe.Ingredients ??= [];

        for (var i = 0; i < recipe.Ingredients.Count; i++)
        {
            var line = recipe.Ingredients[i];
            line.SortOrder = i;
            line.Prep = string.IsNullOrWhiteSpace(line.Prep) ? null : line.Prep.Trim();
        }
    }

    /// <summary>
    /// Turns a name into a URL-friendly slug, for example "Ploughman's Lunch" becomes "ploughmans-lunch".
    /// </summary>
    public static string Slugify(string name)
    {
        var lower = name.ToLowerInvariant().Replace("'", string.Empty).Replace("’", string.Empty);

        return NonAlphanumeric().Replace(lower, "-").Trim('-');
    }

    [GeneratedRegex("[^a-z0-9]+")]
    private static partial Regex NonAlphanumeric();
}
