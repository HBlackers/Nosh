using Microsoft.EntityFrameworkCore;

namespace NoshServer.Application.Context;

public class NoshContext(DbContextOptions<NoshContext> options) : DbContext(options)
{
}
