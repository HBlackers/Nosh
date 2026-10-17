using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoshServer.Application.Models.Recipes;

namespace NoshServer.Application.Context.Configurations;

public class RecipeConfiguration : IEntityTypeConfiguration<Recipe>
{
    public void Configure(EntityTypeBuilder<Recipe> builder)
    {
        builder.Property(r => r.Name).HasMaxLength(200);
        builder.Property(r => r.Slug).HasMaxLength(200);
        builder.HasIndex(r => r.Slug).IsUnique().HasFilter("\"IsDeleted\" = false");

        builder.Property(r => r.Cuisine).HasConversion<string>();
        builder.PrimitiveCollection(r => r.MealTypes).ElementType().HasConversion<string>();
        builder.PrimitiveCollection(r => r.Dietary).ElementType().HasConversion<string>();
        builder.PrimitiveCollection(r => r.Tags).ElementType().HasConversion<string>();
    }
}
