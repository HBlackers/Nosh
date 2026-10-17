# Nosh Server

ASP.NET Core (.NET 10) API for Nosh, a meal planning platform. The React front end lives in `../Client`.

## Stack

- **ASP.NET Core** controllers, **EF Core** with **Npgsql** (PostgreSQL), **FluentValidation**.
- **OpenAPI** document at `/openapi/v1.json` (built-in `Microsoft.AspNetCore.OpenApi`) with **Swagger UI** at `/swagger` (Development only). The client generator reads the OpenAPI document, so keep it accurate.
- HTTPS only: `https://localhost:7263`. The `https` launch profile opens Swagger on startup. There is no HTTP endpoint.
- Routes have no `/api` prefix (the client's dev server strips it before proxying). Use `[Route("[controller]")]`.

## Commands

Run from `Server/`:

```bash
dotnet build NoshServer.slnx
dotnet run --project NoshServer.Api --launch-profile https
```

Docker: `docker compose up --build` (needs the dev cert exported to `Server/.https/nosh.pfx`, see `compose.yaml`).

## Projects

| Project | Contains | References |
| --- | --- | --- |
| `NoshServer.Api` | Controllers, filters, request/response mapping, `Program.cs` | `Api.Contracts`, `Application` |
| `NoshServer.Api.Contracts` | Request and response contracts only | nothing |
| `NoshServer.Application` | Services, repositories, validators, `NoshContext`, other application logic | `Application.Models` |
| `NoshServer.Application.Models` | Models (entities and domain types) only | nothing |

Dependencies only point down this table. `Application` never references `Api` or `Api.Contracts`, so services speak in models, and controllers map between contracts and models.

### Organisation: features vs layers

- **`Application.Models` and `Api.Contracts` are organised by feature.** Each feature gets a folder, and contracts are split by direction:
  ```
  NoshServer.Application.Models/Products/Product.cs
  NoshServer.Api.Contracts/Products/Requests/CreateProductRequest.cs
  NoshServer.Api.Contracts/Products/Responses/ProductResponse.cs
  ```
- **`Api` and `Application` are organised by layer** (Controllers, Services, Repositories, ...), with files named after the feature:
  ```
  NoshServer.Api/Controllers/ProductsController.cs
  NoshServer.Application/Services/Abstractions/IProductService.cs
  NoshServer.Application/Services/ProductService.cs
  NoshServer.Application/Repositories/Abstractions/IProductRepository.cs
  NoshServer.Application/Repositories/ProductRepository.cs
  NoshServer.Application/Validators/ProductValidator.cs
  NoshServer.Application/Context/NoshContext.cs
  ```
  Application layer folders: `Services`, `Repositories`, `Validators`, `Context`.
  Use feature subfolders inside a layer folder once it gets crowded (`Validators/Products/`).
- Namespaces follow the folders.

### Placement rules

1. **Abstractions and implementations are always separated.** Within an application layer folder, interfaces live in `<Layer>/Abstractions/` and their implementations directly in `<Layer>/` (for example `Services/Abstractions/IProductService.cs` and `Services/ProductService.cs`). Never put an interface in the same folder as its implementation.
2. **Models always go in `Application.Models`.** Entities and domain types are never defined in `Application` or `Api`.
3. **Request and response contracts always go in `Api.Contracts`.** Controllers never accept or return a model, and never expose an EF entity.
4. One controller per domain feature (`ProductsController`, `MealPlansController`), not per table or per action group.

## Request flow

`Controller -> Service -> Repository -> NoshContext`

- **Controller**: HTTP only. Takes a request contract, maps it to a model, calls one service, maps the result to a response contract. No business logic, no `NoshContext`, no repositories.
- **Service**: business logic and orchestration. Works with models. Calls repositories, never `NoshContext` directly, and never the HTTP layer (`HttpContext`, `IActionResult`).
- **Repository**: all data access for a feature. The only layer that uses `NoshContext` / `DbSet`. Returns models, never `IQueryable`.
- **`NoshContext`** (`Application/Context/`): EF Core configuration and `DbSet`s. Keep per-entity configuration in `IEntityTypeConfiguration<T>` classes.
- No skipping layers and no calls upward.

## Validation

- Use **FluentValidation**. Validators live in `NoshServer.Application/Validators/`, one per type they validate, named `<Type>Validator`. `Application` can't see the request contracts, so validators target models.
- Validators are discovered automatically from the Application assembly (`AddValidatorsFromAssembly`) and injected as `IValidator<T>`.

## Error handling

`GlobalExceptionFilter` (an MVC `IExceptionFilter`, registered globally) is the single place unhandled exceptions become responses: it logs the exception and returns a `500` problem response with a generic message. Controllers and services don't catch exceptions to build error responses.

It only sees exceptions thrown from controller actions and other MVC filters, not from elsewhere in the pipeline.

## Conventions

- Nullable reference types and implicit usings are on. Prefer `record` for contracts.
- Async all the way down; pass `CancellationToken` from the action to the repository.
- Secrets and connection strings come from configuration (`ConnectionStrings:Nosh`), never from code. `appsettings.Development.json` holds local-only defaults.
- Packages restore from nuget.org; the private `redev` feed is not reachable from every machine.
- Dependency injection registration is not wired for services, repositories or `NoshContext` yet; add it in `Program.cs` as each is introduced.
