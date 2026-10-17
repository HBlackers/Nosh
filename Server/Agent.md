# Nosh Server

ASP.NET Core (.NET 10) API for Nosh, a meal planning platform. The React front end lives in `../Client`.

## Stack

- **ASP.NET Core** controllers, **EF Core** with **Npgsql** (PostgreSQL), **FluentValidation**.
- **OpenAPI** document at `/openapi/v1.json` (built-in `Microsoft.AspNetCore.OpenApi`) with **Swagger UI** at `/swagger` (Development only). The client generator reads the OpenAPI document, so keep it accurate. Enums are serialised as strings at runtime (`JsonStringEnumConverter` on the MVC JSON options) and described as strings in the document by `OpenApi/EnumSchemaTransformer`; keep both in step. Add further document or schema transformers in `NoshServer.Api/OpenApi/` and register them in `AddOpenApi(...)` in `Program.cs`.
- HTTPS only: `https://localhost:7263`. The `https` launch profile opens Swagger on startup. There is no HTTP endpoint.
- Routes have no `/api` prefix (the client's dev server strips it before proxying). Use an explicit lower-case route on each controller (`[Route("ingredients")]`).

## Commands

Run from `Server/`:

```bash
dotnet build NoshServer.slnx
dotnet run --project NoshServer.Api --launch-profile https
```

Migrations (the `dotnet-ef` tool; migrations live in `NoshServer.Application/Context/Migrations`):

```bash
ASPNETCORE_ENVIRONMENT=Development dotnet ef migrations add <Name> --project NoshServer.Application --startup-project NoshServer.Api --output-dir Context/Migrations
ASPNETCORE_ENVIRONMENT=Development dotnet ef database update --project NoshServer.Application --startup-project NoshServer.Api
```

Docker: `docker compose up --build` (needs the dev cert exported to `Server/.https/nosh.pfx`, see `compose.yaml`).

## Projects

| Project | Contains | References |
| --- | --- | --- |
| `NoshServer.Api` | Controllers, filters, request/response mapping, `Program.cs` | `Api.Contracts`, `Application` |
| `NoshServer.Api.Contracts` | Request and response contracts only | `Application.Models` (for the shared enums only) |
| `NoshServer.Application` | Services, repositories, validators, `NoshContext`, other application logic | `Application.Models` |
| `NoshServer.Application.Models` | Models (entities and domain types) only | nothing |

Dependencies only point down this table. `Application` never references `Api` or `Api.Contracts`, so services speak in models, and controllers map between contracts and models. Contracts reuse the enums from `Application.Models` (serialised as strings) so the API and the model can't drift, but must never use entity classes.

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
  Application layer folders: `Services`, `Repositories`, `Validators`, `Context`, `Helpers` (shared static helpers, for example `RecipeHelper` with `Normalise` and `Slugify`).
  Use feature subfolders inside a layer folder once it gets crowded (`Validators/Products/`).
- Namespaces follow the folders.

### Placement rules

1. **Abstractions and implementations are always separated.** Within an application layer folder, interfaces live in `<Layer>/Abstractions/` and their implementations directly in `<Layer>/` (for example `Services/Abstractions/IProductService.cs` and `Services/ProductService.cs`). Never put an interface in the same folder as its implementation.
2. **Models always go in `Application.Models`.** Entities and domain types are never defined in `Application` or `Api`. Fixed value sets (cuisine, meal type, dietary requirement, tag, unit) are enums in the feature's `Enums/` folder, stored as text. Every entity inherits `BaseEntity` (`Application.Models/Common/`): `Id` (Guid), `CreatedAt`, `UpdatedAt`, `DeletedAt`, `IsDeleted`.
3. **Request and response contracts always go in `Api.Contracts`.** Controllers never accept or return a model, and never expose an EF entity.
4. One controller per domain feature (`ProductsController`, `MealPlansController`), not per table or per action group.

## Request flow

`Controller -> Service -> Repository -> NoshContext`

- **Controller**: HTTP only. Takes a request contract, maps it to a model, calls one service, maps the result to a response contract. No business logic, no `NoshContext`, no repositories.
- **Service**: business logic and orchestration. Works with models. Calls repositories, never `NoshContext` directly, and never the HTTP layer (`HttpContext`, `IActionResult`).
- **Repository**: all data access for a feature. The only layer that uses `NoshContext` / `DbSet`. Returns models, never `IQueryable`.
- **`NoshContext`** (`Application/Context/`): EF Core configuration and `DbSet`s. Per-entity configuration goes in `IEntityTypeConfiguration<T>` classes in `Context/Configurations/` (picked up automatically). `NoshContext` turns query tracking off globally (`NoTracking`), so entities returned from queries aren't tracked: repositories must `Add`, `Update` or `Remove` them explicitly to save changes. Soft delete is handled in `BaseRepository`, not the context: reads exclude `IsDeleted` rows and `DeleteAsync` sets `IsDeleted`/`DeletedAt`. `BaseRepository` also sets `CreatedAt`/`UpdatedAt`, and its `GetByIdAsync`/`GetAllAsync`/`GetPagedAsync` take an optional filter expression and an optional `include` function (for related data), so repositories above can shape queries without the base exposing the context.
- No skipping layers and no calls upward.

### Endpoint conventions

- **Pagination:** every list endpoint is paginated. Requests inherit `PagedRequest` (`Page` from 1, `PageSize` 1 to 100, default 20; bound with `[FromQuery]` and range-checked by DataAnnotations) and return `PagedResponse<T>`. Services and repositories return `PagedResult<T>`; `BaseRepository.GetPagedAsync` does the counting and paging, and needs a stable order.
- **Search:** list endpoints that are searched in the app take an optional filter (for example `name`), applied in the repository. Text search is case-insensitive "contains" using `EF.Functions.ILike`, with `%`, `_` and `\` escaped.
- **IDs are generated by the server** (never accepted from the client on create). Duplicate creates are prevented by unique constraints, not client IDs.
- **Status codes:** `GET` 200 or 404; `POST` 201 with a `Location` header; `PUT` 200 with the updated resource or 404; `DELETE` 204 or 404. Services return `null`/`false` for "not found" and the controller turns that into a 404.
- **Mapping:** contracts to models and back is done with static extension methods in `NoshServer.Api/Mappers/`, not a mapping library.
- Annotate every action with `ProducesResponseType` so the OpenAPI document (and the generated client) is accurate.

### Aggregates (recipes and their ingredient lines)

- `RecipeIngredient` lines have no controller of their own: they are created, updated and removed through the recipe endpoints, and `RecipesController` is the only entry point.
- `GET /recipes` returns summaries (no method or lines); `GET /recipes/{id}` returns the full recipe. `RecipeRepository` always loads a recipe with its non-deleted lines, in order, with each line's ingredient.
- The slug is generated from the name on create (`Ploughman's Lunch` becomes `ploughmans-lunch`) and never changes afterwards. Slug clashes are reported against `Name`.
- `PUT` replaces the recipe. Lines are reconciled by id: a line with an id is updated, a line without one is added, and existing lines that are left out are soft deleted. The recipe and its lines are saved in one transaction (`RecipeRepository.UpdateAsync`). A line id must belong to the recipe being updated.
- Deleting a recipe soft deletes its lines in the same transaction.
- Repositories that persist more than one entity override `AddAsync`/`UpdateAsync`/`DeleteAsync`; they keep their own reference to `NoshContext` for that, since the base class keeps its context private.

## Validation

- Use **FluentValidation**. Validators live in `NoshServer.Application/Validators/`, one per type they validate, named `<Type>Validator`. `Application` can't see the request contracts, so validators target models. Validation is split by type: a parent validator delegates nested items to a child validator via `SetValidator` (`RecipeValidator` uses `RecipeIngredientValidator` for each ingredient line).
- Validators are discovered automatically from the Application assembly (`AddValidatorsFromAssembly`) and injected as `IValidator<T>`.
- **Services run the validator** (`ValidateAndThrowAsync`) before writing, which throws FluentValidation's `ValidationException`. Uniqueness rules go in the validator (via a repository `ExistsBy...` method) and are backed by a unique index; where a race could still hit the index, the repository converts the unique-violation into the same `ValidationException`.
- Case-insensitive unique names use the Postgres `citext` column type (for example `Ingredient.Name`).

## Error handling

`GlobalExceptionFilter` (an MVC `IExceptionFilter`, registered globally) is the single place unhandled exceptions become responses: it logs the exception and returns a `500` problem response with a generic message. Controllers and services don't catch exceptions to build error responses.

A FluentValidation `ValidationException` is the one exception type it maps differently: it returns a `400` validation problem (`errors` keyed by property).

It only sees exceptions thrown from controller actions and other MVC filters, not from elsewhere in the pipeline.

## Conventions

- Nullable reference types and implicit usings are on. Prefer `record` for contracts.
- Models: XML `<summary>` docs on every type and property. Nullable properties default to `null` explicitly (`= null`). Navigation properties are `virtual`, nullable and default to `null` (they are only populated when loaded with `Include`, and tracking is off), and go at the bottom of the class, after the scalar and foreign-key properties.
- Async all the way down; pass `CancellationToken` from the action to the repository.
- Secrets and connection strings come from configuration (`ConnectionStrings:Nosh`), never from code. `appsettings.Development.json` holds local-only defaults.
- Packages restore from nuget.org; the private `redev` feed is not reachable from every machine.
- Dependency injection is registered in `Program.cs` (`NoshContext`, repositories, services; validators by assembly scan). Register each new repository and service there.
