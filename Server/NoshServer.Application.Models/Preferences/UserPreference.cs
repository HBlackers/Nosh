using NoshServer.Application.Models.Common;
using NoshServer.Application.Models.Recipes.Enums;

namespace NoshServer.Application.Models.Preferences;

/// <summary>
/// A set of preferences that suit the recipes on offer to someone. Nothing limits how many there are; a client that
/// supports a single user can choose to keep just one. When users are added this is where a user id would go.
/// </summary>
public class UserPreference : BaseEntity
{
    /// <summary>
    /// Dietary requirements the person's recipes should satisfy. Empty means no requirements.
    /// </summary>
    public List<DietaryRequirement> Dietary { get; set; } = [];
}
