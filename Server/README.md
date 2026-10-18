# Nosh Server

The API behind Nosh, a meal planning app. You keep recipes, plan them on a calendar, track what is in your cupboards, and the API tells you what you can cook and what to buy.

ASP.NET Core (.NET 10), EF Core with PostgreSQL, FluentValidation, and an OpenAPI document that the React client generates its SDK from. The client lives in [`../Client`](../Client/README.md).

Conventions for day-to-day coding (placement rules, naming, comment style) are in [`Agent.md`](Agent.md). This README covers how to run and ship it, and why it is built the way it is.

## Local development

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Docker (for PostgreSQL)
- The EF tool, for migrations: `dotnet tool install --global dotnet-ef`
- A trusted HTTPS development certificate: `dotnet dev-certs https --trust`

### Run it

From the repository root, start the database. The root `compose.yaml` has a `db` service whose credentials match `appsettings.Development.json`:

```bash
docker compose up -d db
```

Then, from `Server/`:

```bash
dotnet run --project NoshServer.Api --launch-profile https
```

- The API listens on `https://localhost:7263` (HTTPS only, there is no HTTP endpoint).
- Swagger UI is at `https://localhost:7263/swagger` and the OpenAPI document at `/openapi/v1.json` (Development only).
- In Development the API applies pending migrations on startup, so an empty database gets its schema on the first run.
- Routes have no `/api` prefix. The client's dev server strips `/api` before proxying.

Build everything with `dotnet build NoshServer.slnx`.

### Configuration

| Setting | Where | Notes |
| --- | --- | --- |
| `ConnectionStrings:Nosh` | `appsettings.Development.json` locally, env var `ConnectionStrings__Nosh` elsewhere | Never put a real connection string in source control |
| `SampleRecipes:Recipes` | `appsettings.json` | Built-in sample recipes served by `GET /recipes/samples`; not stored in the database |

### Migrations

Migrations live in `NoshServer.Application/Context/Migrations`. From `Server/`:

```bash
ASPNETCORE_ENVIRONMENT=Development dotnet ef migrations add <Name> --project NoshServer.Application --startup-project NoshServer.Api --output-dir Context/Migrations
ASPNETCORE_ENVIRONMENT=Development dotnet ef database update --project NoshServer.Application --startup-project NoshServer.Api
```

### Changing the API contract

The client's SDK is generated from the OpenAPI document, so after you change a controller, contract or enum, start the API and run `bun run generate:api` in `Client/`. Annotate every action with `ProducesResponseType` so the document stays accurate.

## Deployment

The API ships as a container built from [`Dockerfile`](Dockerfile) (multi-stage: restore, build, publish, then a slim `aspnet:10.0` runtime image running as a non-root user).

- **Port:** the container listens on plain HTTP `8080`. There is no certificate setup, so terminate TLS in front of it (load balancer or ingress).
- **Database:** PostgreSQL 17 is what the compose files use. Supply the connection string as `ConnectionStrings__Nosh`.
- **Migrations are not applied on startup outside Development.** Run them as a deployment step, either with `dotnet ef database update` against the production connection string, or by building a bundle (`dotnet ef migrations bundle`) and running it before the new version starts.
- **Run the full stack locally in containers** from the repository root: `docker compose up --build` starts the API (published on `5161`), the web client (`3000`) and the database. Note that the compose database password and settings are for local use only.
- **Not in place yet:** authentication (nothing is tied to a user), a health endpoint, and any rate limiting. Treat it as a single-user backend until those exist.

## Architecture

### Projects

| Project | Contains | References |
| --- | --- | --- |
| `NoshServer.Api` | Controllers, filters, request/response mapping, OpenAPI setup, `Program.cs` | `Api.Contracts`, `Application` |
| `NoshServer.Api.Contracts` | Request and response contracts only | `Application.Models` (shared enums only) |
| `NoshServer.Application` | Services, repositories, validators, `NoshContext`, helpers | `Application.Models` |
| `NoshServer.Application.Models` | Entities and domain types only | nothing |

Dependencies only point down the table. `Application` never sees the HTTP contracts, so services speak in models and controllers map between the two. Contracts reuse the model enums (serialised as strings) so the API and the model cannot drift, but never expose an entity.

`Application.Models` and `Api.Contracts` are organised **by feature** (and contracts by direction: `Requests/`, `Responses/`). `Api` and `Application` are organised **by layer**, with files named after the feature.

### Request flow

```
Controller -> Service -> Repository -> NoshContext
```

- **Controller:** HTTP only. Maps a request contract to a model, calls the service, maps the result to a response. No business logic. For update and delete it loads the entity first and returns `404` if it is missing.
- **Service:** business rules and orchestration. Validates (FluentValidation) before writing. Never touches `NoshContext` or HTTP types.
- **Repository:** the only layer that uses `NoshContext`. Returns models, never `IQueryable`. Soft delete and timestamps are handled in `BaseRepository`.
- A service that has to change several repositories' data all-or-nothing uses `IUnitOfWork.ExecuteAsync` (a transaction on the shared context).

### Cross-cutting rules and why

| Rule | Why |
| --- | --- |
| **Soft delete everywhere** (`IsDeleted`, `DeletedAt`); reads exclude deleted rows | Nothing is lost by accident, and unique indexes carry a `WHERE "IsDeleted" = false` filter so a deleted name can be reused |
| **IDs are generated by the server** | Duplicate creates are stopped by unique constraints, not by trusting client IDs |
| **Enums are stored and serialised as strings** | Readable data and a stable API; `EnumSchemaTransformer` keeps the OpenAPI document matching |
| **Every list endpoint is paginated** (`PagedRequest`, `PagedResponse<T>`) | Predictable cost, one shape for the client. The two aggregate reads (calendar availability, shopping list) work out a whole range in memory, then page or return it |
| **Validation lives in validators on models**, uniqueness backed by a unique index | One place for rules; the index catches the race the validator cannot |
| **One error path:** `GlobalExceptionFilter` turns a validation exception into a `400` problem and anything else into a logged `500` | Controllers and services never build error responses |
| **Case-insensitive unique names use Postgres `citext`** | Case-insensitivity in the database, not in application code |
| **Dates are `DateOnly`** (calendar days, no time zones) | A meal plan is about days, not instants |

## Domains

### Ingredients

A shared catalogue of ingredient names, reused by recipes and inventory. Names are unique and case-insensitive. An ingredient that is in stock cannot be removed.

### Recipes

A recipe has a name, slug (generated from the name, never changes), servings, cuisine, meal types, dietary requirements, tags, method steps and ordered **ingredient lines** (ingredient, optional quantity, optional unit, prep note).

- Ingredient lines have no controller of their own: they are created, updated and removed through the recipe endpoints. `PUT` replaces the recipe and reconciles lines by id (update, add, soft delete) in one transaction.
- `GET /recipes` returns summaries; `GET /recipes/{id}` returns the full recipe. The list can be searched by name and filtered by dietary requirement (all selected must match).
- Deleting a recipe soft deletes its lines and its schedules.
- `GET /recipes/samples` serves the sample recipes from configuration. They are never in the database.

### Measurement units

Units are an enum whose **high bits hold the category** (mass, volume, count) and low bits identify the unit (`MeasurementUnit`, `MeasurementCategory`). The rules live in `MeasurementUnitExtensions`:

- Mass and volume convert within their category (g; ml, tbsp = 15 ml, tsp = 5 ml).
- A count unit (tin, clove, slice...) only matches itself. Two tins cannot become cloves.
- A null unit is a plain count (4 sausages) and only matches null.
- Quantities are always combined and compared in the **smaller** of the two units, so amounts stay whole where possible.

Everything that adds or compares quantities (adding stock, the shopping list, stock availability) goes through these helpers, so the rules exist once.

### Schedules

A `RecipeSchedule` is a recipe, a start date, a meal and an optional recurrence rule (daily, weekly on chosen days, monthly, with an end date or an occurrence limit). **Occurrences are not stored.** `ScheduleExpander` works the dates out from the rule whenever the calendar is read, so changing a schedule changes every occurrence at once. To change from a date onward, end the schedule and create a new one.

`GET /schedules?from=&to=` returns the occurrences in a range (up to 366 days), ordered by date then meal. Weeks start on Monday and "every N weeks" counts from the week the schedule starts in.

Each occurrence also carries its **event** (if any) and its **availability**, described below.

### Schedule events: completing and skipping a meal

A `ScheduleEvent` records that one occurrence (`ScheduleId` + `Date`) was `Completed` or `Skipped`. A schedule has many events, at most one per date, and the date must be one the schedule falls on. It has its own controller at `/schedule-events` (list, get, create, change status, delete).

- **Completing a meal takes its ingredients out of stock**, in the same transaction as the event. It takes as much as there is of each ingredient and removes an item that is used up. Skipping leaves stock alone.
- **Undoing does not put stock back.** Deleting an event, or changing completed to skipped, leaves stock as it is. Changing skipped to completed takes the stock at that point. We do not record what each completion took, so there is nothing exact to restore; people fix stock on the inventory page.
- Completed and skipped meals stop counting for the shopping list and for availability.

### Inventory

`InventoryItem` is how much of an ingredient is in stock, at most one per ingredient, quantity above zero, null unit meaning a plain count.

- `POST /inventory` **adds** stock and merges into the existing item (converting units and moving to the smaller one). It returns `400` if the units cannot be combined.
- `PUT /inventory/{id}` **sets** the quantity. `DELETE` removes the item. A quantity of zero is not allowed; delete the item instead.
- `GET /inventory` is paged and searched by ingredient name.

### User preferences

A `UserPreference` is a set of dietary requirements (vegetarian, vegan, gluten free, dairy free) with its own id, served as an ordinary collection at `/preferences` (paged list, get, create, update, delete).

The server **does not cap how many exist**. There are no users yet, and a "only one row" rule baked into the API would be something to rip out when they arrive. A client for a single user keeps one by reading the first item and only creating one when the list is empty. When users are added, a user id goes on the entity and uniqueness is enforced per user.

The preference does not filter anything on the server. Clients apply it by passing `dietary` to `GET /recipes` and `GET /recipes/samples`.

### Stock availability (the calendar's traffic light)

`StockAllocator` works on an in-memory copy of the inventory and hands it to planned meals one at a time, **in date then meal order**, so a later meal only sees what earlier meals left. If you have two onions and Monday and Thursday both need two, Monday is ready and Thursday is not.

Each pending occurrence gets a `MealAvailability`:

| Status | Meaning |
| --- | --- |
| `Ready` | every ingredient line is fully covered |
| `Partial` | some stock of what is needed |
| `Missing` | none of it is in stock |

It also lists the lines that are not fully covered. A line without an amount ("salt and pepper") is covered by any stock and takes none of it. A line whose stock unit cannot be converted counts as lacking. Allocation only covers the requested range, so stock used by meals before `from` is not counted.

### Shopping list

`GET /shopping-list?from=&to=` (up to 31 days) totals what the pending occurrences in the range need and compares it with stock. Nothing is stored.

- Recurring schedules count once per date; completed and skipped meals are left out.
- Amounts that can be converted are summed; an ingredient measured in grams and as a plain count appears as two items.
- Each item has what is needed, what is in stock, what is still to buy and a status: `ToBuy`, `Covered` or `UnitMismatch`.
- `UnplannedStock` lists stock that no planned recipe uses.

The shopping list and the calendar share the same rules, so an item is `Covered` exactly when every meal that uses it shows `Ready` for it.

## Decisions worth knowing

- **Derived data stays derived.** Occurrences, availability and the shopping list are computed on read, not stored. The cost is recomputing per request, which is cheap at this scale; the benefit is that nothing can go out of date.
- **Stock is a shared pool, not dated.** Allocation is only within the requested range. Viewing next week does not know what this week will use unless those meals are in range. Fixing that would mean an optional allocate-from date.
- **No audit trail for stock.** Completing a meal changes inventory in place. See the note on undo above.
- **No users yet.** Schedules, stock and recipes are global. Authentication and per-user data are the next structural change.
- **OpenAPI is the contract.** Keep it accurate; the client's types and SDK are generated from it.
