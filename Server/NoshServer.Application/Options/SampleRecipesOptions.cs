using NoshServer.Application.Models.Recipes.Sample;

namespace NoshServer.Application.Options;

/// <summary>
/// The sample recipes configured in appsettings under <see cref="SectionName"/>.
/// </summary>
public class SampleRecipesOptions
{
    /// <summary>
    /// The configuration section these options are bound from.
    /// </summary>
    public const string SectionName = "SampleRecipes";

    /// <summary>
    /// The sample recipes.
    /// </summary>
    public List<SampleRecipe> Recipes { get; set; } = [];
}
