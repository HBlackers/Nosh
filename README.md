# Nosh

A meal planning app. Keep your recipes, plan them on a weekly calendar, track what's in your cupboards, and Nosh tells you which planned meals you can cook and what you still need to buy.

The calendar is the home page. Each planned recipe shows whether you have the ingredients (green, yellow or red), and you complete or skip it with one tap. Completing a meal takes its ingredients out of your stock, and the shopping list is worked out from what the week still needs against what you have.

## Repository layout

| Folder | What it is | Docs |
| --- | --- | --- |
| [`Client/`](Client) | React front end (Bun, TanStack Router and Query, Tailwind, shadcn/ui) | [Client README](Client/README.md) |
| [`Server/`](Server) | ASP.NET Core (.NET 10) API with EF Core and PostgreSQL | [Server README](Server/README.md) |
| [`compose.yaml`](compose.yaml) | Runs the whole stack: database, API and client | below |

Each side has its own README covering local development, configuration, deployment, its architecture rules and the reasoning behind them. Start there for anything specific to one side. Each also has an `Agent.md` with the day-to-day coding conventions.

## How the pieces fit

```
Browser  ->  Client server (Bun, :3000)  ->  API (ASP.NET, :8080 / :7263)  ->  PostgreSQL
              serves the app and            business rules and data
              proxies /api/*
```

- The browser only calls `/api/...` on the client's own origin. The client server proxies those calls to the API, so there is no CORS setup.
- The API publishes an OpenAPI document. The client generates its typed SDK from it, so the two sides share one contract. After changing a controller, contract or enum on the server, regenerate the client (see the [Client README](Client/README.md#regenerating-the-api-client)).
- Stock availability, the shopping list and the calendar's colours are all worked out by the server. The client displays them and sends actions (complete, skip, add stock).

## What the app does

| Area | In short |
| --- | --- |
| **Recipes and ingredients** | A shared ingredient catalogue and recipes made of ordered ingredient lines, searchable and filterable by dietary requirement |
| **Calendar** | Recipes planned once or repeating (daily, weekly, monthly). Dates are worked out from the rule, not stored |
| **Completing and skipping** | Marking a planned meal as done or skipped. Done takes its ingredients out of stock |
| **Inventory** | What you have, with unit-aware merging (grams with grams, volumes with volumes, a count unit only with itself) |
| **Availability** | Each upcoming meal is Ready, Some missing or Missing, with earlier meals taking their share of stock first |
| **Shopping list** | What the week needs, minus what you have, with what's left to buy |

The [Server README](Server/README.md#domains) explains each of these in detail, including the rules and the trade-offs.

Nosh is for people on older, smaller phones, so the client treats WCAG 2.1 AA contrast, touch-sized targets and a phone-first layout as requirements. The rules are in the [Client README](Client/README.md#accessibility-and-older-phones).

## Quick start

You need Docker, [.NET 10](https://dotnet.microsoft.com/download) and [Bun](https://bun.sh) for development.

**Everything in containers**, the quickest way to look around:

```bash
docker compose up --build
```

Then open http://localhost:3000. The API is published on port 5161. The compose database settings are for local use only, and the database starts empty, so add some ingredients and recipes first.

**Develop with hot reload**: run the database in Docker and the API and client on your machine:

```bash
docker compose up -d db
```

```bash
cd Server && dotnet run --project NoshServer.Api --launch-profile https
```

```bash
cd Client && bun install && bun dev
```

The client is at http://localhost:3000 and the API's Swagger UI at https://localhost:7263/swagger. The API creates the database schema on its first run in Development. Setup details, such as trusting the .NET development certificate, are in the [Server README](Server/README.md#local-development) and the [Client README](Client/README.md#local-development).

## Deployment

Both sides ship as containers (`Server/Dockerfile` and `Client/Dockerfile`), and the root `compose.yaml` wires them to PostgreSQL. Things to know before deploying anywhere real:

- Database migrations are only applied automatically in Development. Run them as a deployment step (see the [Server README](Server/README.md#deployment)).
- The client needs its own server because it also proxies `/api`, so it can't be hosted as static files alone (see the [Client README](Client/README.md#deployment)).
- There is no authentication yet. Schedules, stock and recipes are global, so treat the app as single-user until that exists.
