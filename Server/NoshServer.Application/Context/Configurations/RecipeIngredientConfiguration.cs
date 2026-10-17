using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoshServer.Application.Models.Recipes;

namespace NoshServer.Application.Context.Configurations;

public class RecipeIngredientConfiguration : IEntityTypeConfiguration<RecipeIngredient>
{
    public void Configure(EntityTypeBuilder<RecipeIngredient> builder)
    {
        builder.Property(ri => ri.Unit).HasConversion<string>();
        builder.Property(ri => ri.Prep).HasMaxLength(200);

        // Lines belong to their recipe: removing a recipe removes its lines.
        builder.HasOne(ri => ri.Recipe)
            .WithMany(r => r.Ingredients)
            .HasForeignKey(ri => ri.RecipeId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // An ingredient used by any recipe line can't be removed.
        builder.HasOne(ri => ri.Ingredient)
            .WithMany(i => i.RecipeIngredients)
            .HasForeignKey(ri => ri.IngredientId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}
