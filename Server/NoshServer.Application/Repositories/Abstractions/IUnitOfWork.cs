namespace NoshServer.Application.Repositories.Abstractions;

/// <summary>
/// Lets a service make changes through several repositories as one all-or-nothing step.
/// </summary>
public interface IUnitOfWork
{
    /// <summary>
    /// Runs the work in a transaction. If the work throws, nothing it changed is kept.
    /// </summary>
    Task ExecuteAsync(Func<Task> work, CancellationToken cancellationToken = default);
}
