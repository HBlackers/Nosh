using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoshServer.Application.Models.Schedules;

namespace NoshServer.Application.Context.Configurations;

public class ScheduleEventConfiguration : IEntityTypeConfiguration<ScheduleEvent>
{
    public void Configure(EntityTypeBuilder<ScheduleEvent> builder)
    {
        builder.Property(e => e.Status).HasConversion<string>();

        // An occurrence is completed or skipped once. Also supports finding the events within a date range.
        builder.HasIndex(e => new { e.ScheduleId, e.Date }).IsUnique().HasFilter("\"IsDeleted\" = false");
        builder.HasIndex(e => e.Date);

        builder.HasOne(e => e.Schedule)
            .WithMany()
            .HasForeignKey(e => e.ScheduleId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}
