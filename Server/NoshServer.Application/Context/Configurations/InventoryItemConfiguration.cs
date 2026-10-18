using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoshServer.Application.Models.Inventory;

namespace NoshServer.Application.Context.Configurations;

public class InventoryItemConfiguration : IEntityTypeConfiguration<InventoryItem>
{
    public void Configure(EntityTypeBuilder<InventoryItem> builder)
    {
        builder.Property(i => i.Unit).HasConversion<string>();

        // One item per ingredient: new stock is merged into the existing item.
        builder.HasIndex(i => i.IngredientId).IsUnique().HasFilter("\"IsDeleted\" = false");

        // An ingredient that is in stock can't be removed.
        builder.HasOne(i => i.Ingredient)
            .WithMany()
            .HasForeignKey(i => i.IngredientId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}
