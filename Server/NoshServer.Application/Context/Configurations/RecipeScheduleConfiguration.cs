using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoshServer.Application.Models.Schedules;

namespace NoshServer.Application.Context.Configurations;

public class RecipeScheduleConfiguration : IEntityTypeConfiguration<RecipeSchedule>
{
    public void Configure(EntityTypeBuilder<RecipeSchedule> builder)
    {
        builder.Property(s => s.MealType).HasConversion<string>();
        builder.Property(s => s.Frequency).HasConversion<string>();
        builder.PrimitiveCollection(s => s.DaysOfWeek).ElementType().HasConversion<string>();

        // Supports finding the schedules that could fall within a date range.
        builder.HasIndex(s => new { s.StartDate, s.EndDate });

        // Deleting a recipe soft deletes its schedules (see RecipeRepository.DeleteAsync), so the foreign key only guards hard deletes.
        builder.HasOne(s => s.Recipe)
            .WithMany()
            .HasForeignKey(s => s.RecipeId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}
