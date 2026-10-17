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
    /// Builds an ILIKE "contains" pattern for the text, escaping the wildcard characters (escape character is a backslash).
    /// </summary>
    public static string ContainsPattern(string text)
    {
        return "%" + text.Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_") + "%";
    }
}
