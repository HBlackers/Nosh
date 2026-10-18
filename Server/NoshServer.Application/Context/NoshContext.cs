using Microsoft.EntityFrameworkCore;
using NoshServer.Application.Models.Ingredients;
using NoshServer.Application.Models.Inventory;
using NoshServer.Application.Models.Preferences;
using NoshServer.Application.Models.Recipes;
using NoshServer.Application.Models.Schedules;

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

    /// <summary>
    /// Recipes planned on the calendar.
    /// </summary>
    public DbSet<RecipeSchedule> RecipeSchedules => Set<RecipeSchedule>();

    /// <summary>
    /// Scheduled recipes that were completed or skipped on a date.
    /// </summary>
    public DbSet<ScheduleEvent> ScheduleEvents => Set<ScheduleEvent>();

    /// <summary>
    /// Ingredients in stock.
    /// </summary>
    public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();

    /// <summary>
    /// Preferences that suit the recipes on offer.
    /// </summary>
    public DbSet<UserPreference> UserPreferences => Set<UserPreference>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("citext");

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(NoshContext).Assembly);
    }
}
