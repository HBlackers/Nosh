using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoshServer.Application.Models.Preferences;

namespace NoshServer.Application.Context.Configurations;

public class UserPreferenceConfiguration : IEntityTypeConfiguration<UserPreference>
{
    public void Configure(EntityTypeBuilder<UserPreference> builder)
    {
        builder.PrimitiveCollection(p => p.Dietary).ElementType().HasConversion<string>();
    }
}
