using NoshServer.Application.Context;
using NoshServer.Application.Repositories.Abstractions;

namespace NoshServer.Application.Repositories;

/// <inheritdoc cref="IUnitOfWork"/>
public class UnitOfWork(NoshContext context) : IUnitOfWork
{
    /// <inheritdoc />
    public async Task ExecuteAsync(Func<Task> work, CancellationToken cancellationToken = default)
    {
        await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);

        await work();
        await transaction.CommitAsync(cancellationToken);
    }
}
