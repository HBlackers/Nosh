using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace NoshServer.Application.Repositories;

internal static class RepositoryHelpers
{
    /// <summary>
    /// Whether the exception was caused by a unique constraint violation.
    /// </summary>
    public static bool IsUniqueViolation(this DbUpdateException exception)
    {
        return exception.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation };
    }

    /// <summary>
    /// Builds an ILIKE "contains" pattern for the text, matching any wildcard characters in it literally
    /// (the escape character is a backslash). Blank text gives <c>%</c>, which matches everything.
    /// </summary>
    public static string ContainsPattern(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return "%";
        }

        return "%" + text.Trim().Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_") + "%";
    }
}
