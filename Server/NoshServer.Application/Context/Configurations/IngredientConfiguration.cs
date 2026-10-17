using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoshServer.Application.Models.Ingredients;

namespace NoshServer.Application.Context.Configurations;

public class IngredientConfiguration : IEntityTypeConfiguration<Ingredient>
{
    public void Configure(EntityTypeBuilder<Ingredient> builder)
    {
        // citext makes comparisons and the unique index ignore case. Length (200) is enforced by the validator.
        builder.Property(i => i.Name).HasColumnType("citext");
        builder.HasIndex(i => i.Name).IsUnique().HasFilter("\"IsDeleted\" = false");
    }
}
