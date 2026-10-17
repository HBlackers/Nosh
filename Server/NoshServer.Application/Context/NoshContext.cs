using Microsoft.EntityFrameworkCore;
using NoshServer.Application.Models.Ingredients;
using NoshServer.Application.Models.Recipes;

namespace NoshServer.Application.Context;

/// <summary>
/// EF Core database context for Nosh. Queries are not tracked by default.
/// </summary>
public sealed class NoshContext : DbContext
{
    public NoshContext(DbContextOptions<NoshContext> options) : base(options)
    {
        ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }

    /// <summary>
    /// Recipes available to users.
    /// </summary>
    public DbSet<Recipe> Recipes => Set<Recipe>();

    /// <summary>
    /// Shared ingredient catalogue.
    /// </summary>
    public DbSet<Ingredient> Ingredients => Set<Ingredient>();

    /// <summary>
    /// Ingredient lines that link recipes to ingredients.
    /// </summary>
    public DbSet<RecipeIngredient> RecipeIngredients => Set<RecipeIngredient>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(NoshContext).Assembly);
    }
}
