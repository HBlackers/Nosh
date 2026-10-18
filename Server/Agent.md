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

In Development the API applies pending migrations automatically on startup (`Program.cs`), so `dotnet run` against an empty database creates the schema. The Docker compose files set `ASPNETCORE_ENVIRONMENT=Development` so a fresh database gets its schema when the container starts; any other environment (a real deployment) does not migrate on startup.

Docker: `docker compose up --build`. In the container the API listens on plain HTTP port 8080 (published as 5161); there is no certificate setup. The HTTPS-only `https` launch profile is for running locally.

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
  Application layer folders: `Services`, `Repositories`, `Validators`, `Context`, `Helpers` (shared static helpers, for example `RecipeHelper` with `Normalise` and `Slugify`), `Options` (strongly typed configuration bound from appsettings).
  Use feature subfolders inside a layer folder once it gets crowded (`Validators/Products/`).
- Namespaces follow the folders.

### Placement rules

1. **Abstractions and implementations are always separated.** Within an application layer folder, interfaces live in `<Layer>/Abstractions/` and their implementations directly in `<Layer>/` (for example `Services/Abstractions/IProductService.cs` and `Services/ProductService.cs`). Never put an interface in the same folder as its implementation.
2. **Models always go in `Application.Models`.** Entities and domain types are never defined in `Application` or `Api`. Fixed value sets (cuisine, meal type, dietary requirement, tag, unit) are enums in the feature's `Enums/` folder, stored as text. Every entity inherits `BaseEntity` (`Application.Models/Common/`): `Id` (Guid), `CreatedAt`, `UpdatedAt`, `DeletedAt`, `IsDeleted`.
3. **Request and response contracts always go in `Api.Contracts`.** Controllers never accept or return a model, and never expose an EF entity.
4. One controller per domain feature (`ProductsController`, `MealPlansController`), not per table or per action group.

## Request flow

`Controller -> Service -> Repository -> NoshContext`

- **Controller**: HTTP only. Takes a request contract, maps it to a model, calls the service, maps the result to a response contract. No business logic, no `NoshContext`, no repositories. **Update and delete:** the controller first loads the existing entity through the service and returns `404` if it doesn't exist, then (for update) applies the request onto that entity with an `ApplyTo` mapper and passes the entity to the service. The entity keeps its own `Id`, slug and timestamps; nothing outside the mapper changes them.
- **Service**: business logic and orchestration. Works with models. `UpdateAsync` and `DeleteAsync` receive an entity that already exists and has already been updated: they normalise, validate and save, and don't look entities up or set ids. Calls repositories, never `NoshContext` directly, and never the HTTP layer (`HttpContext`, `IActionResult`).
- **Repository**: all data access for a feature. The only layer that uses `NoshContext` / `DbSet`. Returns models, never `IQueryable`.
- **`NoshContext`** (`Application/Context/`): EF Core configuration and `DbSet`s. Per-entity configuration goes in `IEntityTypeConfiguration<T>` classes in `Context/Configurations/` (picked up automatically). `NoshContext` turns query tracking off globally (`NoTracking`), so entities returned from queries aren't tracked: repositories must `Add`, `Update` or `Remove` them explicitly to save changes. Soft delete is handled in `BaseRepository`, not the context: reads exclude `IsDeleted` rows and `DeleteAsync` sets `IsDeleted`/`DeletedAt`. `BaseRepository` also sets `CreatedAt`/`UpdatedAt`, and its `GetByIdAsync`/`GetAllAsync`/`GetPagedAsync` take an optional filter expression and an optional `include` function (for related data), so repositories above can shape queries without the base exposing the context.
- No skipping layers and no calls upward.

### Endpoint conventions

- **Pagination:** every list endpoint is paginated. Requests inherit `PagedRequest` (`Page` from 1, `PageSize` 1 to 100, default 20; bound with `[FromQuery]` and range-checked by DataAnnotations) and return `PagedResponse<T>`. Services and repositories return `PagedResult<T>`; `BaseRepository.GetPagedAsync` does the counting and paging, and needs a stable order.
- **Search:** list endpoints that are searched in the app take an optional filter (for example `name`), applied in the repository. Searches are written as plain SQL in the repository and passed to EF with `Context.<Set>.FromSql($"...")` (every value is a parameter, never concatenated), then paged through the protected `BaseRepository.GetPagedAsync(source, ...)`, which also excludes soft-deleted rows. Text search is `ILIKE` "contains"; build the pattern with `RepositoryHelpers.ContainsPattern`, which escapes `%`, `_` and `\`.
- **Recipe dietary filter:** `GET /recipes` and `GET /recipes/samples` take repeatable `dietary` query values (`?dietary=Vegan&dietary=GlutenFree`) and return only recipes that satisfy **all** of them; it combines with the `name` search. In the database it is `"Dietary" @> {required}` on the `text[]` column, in the same SQL as the name search.
- **IDs are generated by the server** (never accepted from the client on create). Duplicate creates are prevented by unique constraints, not client IDs.
- **Status codes:** `GET` 200 or 404; `POST` 201 with a `Location` header; `PUT` 200 with the updated resource or 404; `DELETE` 204 or 404. `GetByIdAsync` returns `null` for "not found" and the controller turns that into a 404, including before an update or delete.
- **Mapping:** contracts to models and back is done with static extension methods in `NoshServer.Api/Mappers/`, not a mapping library.
- Annotate every action with `ProducesResponseType` so the OpenAPI document (and the generated client) is accurate.

### Aggregates (recipes and their ingredient lines)

- `RecipeIngredient` lines have no controller of their own: they are created, updated and removed through the recipe endpoints, and `RecipesController` is the only entry point.
- `GET /recipes` returns summaries (no method or lines); `GET /recipes/{id}` returns the full recipe. `RecipeRepository` always loads a recipe with its non-deleted lines, in order, with each line's ingredient.
- The slug is generated from the name on create (`Ploughman's Lunch` becomes `ploughmans-lunch`) and never changes afterwards. Slug clashes are reported against `Name`.
- `PUT` replaces the recipe. Lines are reconciled by id: a line with an id is updated, a line without one is added, and existing lines that are left out are soft deleted. The recipe and its lines are saved in one transaction (`RecipeRepository.UpdateAsync`). A line id must belong to the recipe being updated.
- Deleting a recipe soft deletes its lines (and its schedules) in the same transaction.
- Repositories that persist more than one entity override `AddAsync`/`UpdateAsync`/`DeleteAsync`; they use the base class's protected `Context` for that.

### Schedules (recipes planned on a calendar)

- A `RecipeSchedule` is one row: a recipe, a start date, a meal and an optional recurrence rule (`Frequency` None/Daily/Weekly/Monthly, `Interval`, `DaysOfWeek`, and an end by `EndDate` or `MaxOccurrences`, or neither). **Occurrences are not stored**: `ScheduleExpander` (`Application/Helpers`) works the dates out from the rule when the calendar is read. A one-off is `Frequency = None`.
- Dates are `DateOnly` (calendar days, no time zones). Weeks start on Monday and "every N weeks" counts from the week the schedule starts in. Monthly repeats on the start date's day of the month, using the last day when the month is shorter. The end date and occurrence limit are counted from the start date, not from the requested range.
- `GET /schedules?from=&to=&page=&pageSize=` returns a `PagedResponse` of occurrences (date, meal, recurring flag, a light recipe summary, its `Event` and its `Availability`), ordered by date then meal. The range is required and limited to 366 days. The full recipe comes from `GET /recipes/{id}`.
- Changes to a schedule always apply to the whole schedule (no moving single occurrences). To change from a date onward, end the schedule and create a new one. Completing or skipping a single occurrence is a schedule event (below).
- Deleting a recipe soft deletes its schedules too (in the same transaction as its ingredient lines, in `RecipeRepository.DeleteAsync`). Schedules aren't tied to a user yet.

### Schedule events (completing and skipping a meal)

- A `ScheduleEvent` records that one occurrence of a schedule (`ScheduleId` + `Date`) was `Completed` or `Skipped`. A schedule has many events, at most one per date (unique index, soft-delete aware). It has its own controller, `ScheduleEventsController` (`/schedule-events`: list with optional `scheduleId`/`from`/`to`, get, create, update status, delete). The date must be one the schedule falls on.
- **Completing takes the recipe's ingredients out of stock** in the same transaction as the event (`IUnitOfWork.ExecuteAsync`, `ScheduleEventService`). It takes as much as there is of each ingredient and removes an item that is used up. Skipping leaves stock alone. Deleting an event, or changing completed to skipped, does **not** put stock back. Changing skipped to completed takes the stock then.
- Occurrences with an event are returned with `Event` set and no `Availability`, and drop out of the shopping list.

### User preferences

- `UserPreference` is a set of dietary requirements (`Dietary`, empty means none) with its own id, exposed as a plain collection at `/preferences` (paged list, get, create, update, delete). **The server deliberately does not limit how many exist**: there are no users yet, and a single-row rule would have to be undone the day there are. A client for a single user keeps one by reading the first item and creating one only when the list is empty. When users arrive, a `UserId` goes on this entity and uniqueness is enforced per user.
- The preference does not filter anything on the server. Clients apply it by passing `dietary` to `GET /recipes` and `GET /recipes/samples`.

### Stock availability (calendar status)

- `StockAllocator` (`Application/Helpers`) works on an in-memory copy of the inventory and hands it to meals one at a time, so a later meal only sees what earlier ones left. `GET /schedules` runs it over the pending occurrences in date then meal order. The range only: stock used by meals before `from` isn't counted.
- `MealAvailability.Status`: `Ready` (every ingredient line covered), `Partial` (some stock of what is needed), `Missing` (none). `Lacking` lists the lines not fully covered. A line without an amount is covered by any stock of the ingredient and takes none. A line whose stock unit can't be converted counts as lacking.
- Unit conversion rules are in `MeasurementUnitExtensions` (`CanConvertTo`, `Convert`, `Smaller`): mass and volume convert within their category, a count unit only matches itself, null matches only null. Combine and compare quantities in the smaller unit.

### Inventory

- `InventoryItem`: how much of an ingredient is in stock, at most one per ingredient (unique index), quantity above zero, a null unit meaning a plain count. `POST /inventory` adds stock and merges into the existing item (converting units, moving to the smaller one, `400` if the units can't be combined); `PUT` sets the quantity; `DELETE` removes the item. `GET /inventory` is paged and searched by ingredient name.

### Shopping list

- `GET /shopping-list?from=&to=` (limited to 31 days) works out what the pending occurrences in the range need and what is still to buy. It isn't stored. Recurring schedules count once per date; completed and skipped occurrences are left out.
- Amounts that can be converted are summed, so an ingredient measured in grams and as a plain count gives two items. Each item has `Needed`, `InStock`, `ToBuy` and a `Status` of `ToBuy`, `Covered` or `UnitMismatch`. Lines without an amount only make an item when no recipe gives an amount. `UnplannedStock` lists stock that no planned recipe uses.

### Sample recipes (configuration data)

- A set of sample recipes lives in `NoshServer.Api/appsettings.json` under `SampleRecipes:Recipes` (originally the project sample JSON). They are **not** in the database.
- The old slug-style `id` is now `Slug`, and the sample classes have no id: a sample recipe is identified by its slug. Enum-like values are written as enum names (`GlutenFree`, `Tablespoon`), because the configuration binder parses them straight into the enums. Ingredient lines are by name (`Item`).
- `SampleRecipesOptions` (`Application/Options/`) is bound in `Program.cs`; `RecipeService` gets it through `IOptions<SampleRecipesOptions>` and keeps the list in a private property. The models (`SampleRecipe`, `SampleRecipeIngredient`) are plain configuration types, not entities. Sample code is kept in `Sample` subfolders by feature: `Application.Models/Recipes/Sample/` and `Api.Contracts/Recipes/Sample/Responses/`.
- `GET /recipes/samples` (paginated, optional `name` filter, same `GetRecipesRequest`) serves them through `IRecipeService.GetSampleRecipes`. It never touches the database.

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
- **Several repositories in one step:** a service that must change more than one repository's data all-or-nothing uses `IUnitOfWork.ExecuteAsync` (a transaction on the shared `NoshContext`).
