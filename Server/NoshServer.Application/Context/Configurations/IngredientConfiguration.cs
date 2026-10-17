using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoshServer.Application.Models.Ingredients;

namespace NoshServer.Application.Context.Configurations;

public class IngredientConfiguration : IEntityTypeConfiguration<Ingredient>
{
    public void Configure(EntityTypeBuilder<Ingredient> builder)
    {
        builder.Property(i => i.Name).HasMaxLength(200);
        builder.HasIndex(i => i.Name).IsUnique().HasFilter("\"IsDeleted\" = false");
    }
}
