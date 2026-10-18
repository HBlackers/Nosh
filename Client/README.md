# Nosh Client

The React front end for Nosh, a meal planning app. The calendar is the home page and the centre of daily use: each planned recipe shows whether you have the ingredients for it, and you complete or skip it with one tap. Stock, a shopping list and the recipe and ingredient catalogues sit around it.

The API lives in [`../Server`](../Server/README.md). Coding conventions (comment style, brand and UI rules, API layering in detail) are in [`Agent.md`](Agent.md). This README covers how to run and ship the client, and why it is built the way it is.

## Stack

- **Bun** for runtime, package manager, dev server and bundler. No Vite, no Node tooling.
- **React 19** and **TypeScript** (strict).
- **TanStack Router** (code-based routes) and **TanStack Query** (server state).
- **Tailwind CSS v4** (configured in CSS, no `tailwind.config`) and **shadcn/ui** (`new-york` style) on Radix primitives.
- A typed API client generated from the server's OpenAPI document with `@hey-api/openapi-ts`.

## Local development

### Prerequisites

- [Bun](https://bun.sh)
- The API running. See the [server README](../Server/README.md): start the database with `docker compose up -d db` from the repository root, then run the API from `Server/`.

### Run it

```bash
bun install
bun dev          # dev server with hot reload on http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `bun dev` | dev server with hot reload |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run build` | production build into `dist/` |
| `bun start` | production server (`NODE_ENV=production`) |
| `bun run generate:api` | regenerate the API client (needs the API running) |

### How it talks to the API

The browser only ever calls `/api/...` on its own origin. `src/index.ts` serves the app and **proxies `/api/*` to the API**, stripping the `/api` prefix (the server's routes have none). That keeps everything same-origin, so there is no CORS setup and no API URL in the browser code.

| Variable | Default | Meaning |
| --- | --- | --- |
| `API_URL` | `https://localhost:7263` | Where the proxy forwards to |
| `PORT` | `3000` | Port the client server listens on |

Locally the API uses the self-signed .NET development certificate, which the proxy accepts outside production.

### Regenerating the API client

`src/lib/api/generated/` is generated output (never edit it, but do commit it). After any server controller, contract or enum change:

1. Start the API (`dotnet run --project NoshServer.Api --launch-profile https` in `Server/`).
2. Run `bun run generate:api`. Set `OPENAPI_URL` to read the document from somewhere else.

`src/lib/api/client.ts` is the one place the client is configured (base URL, error behaviour: SDK calls throw on non-2xx).

## Deployment

The client ships as a container built from [`Dockerfile`](Dockerfile): it installs dependencies and runs `bun src/index.ts` with `NODE_ENV=production`, on port `3000`.

- **It needs the Bun server, not just static files.** The server is also the `/api` proxy. `bun run build` produces a static bundle in `dist/`, but hosting that on its own would need your host to proxy `/api` to the API itself.
- **Set `API_URL`** to the API's address as seen from the client container, for example `http://api:8080` on a shared network.
- **Whole stack:** from the repository root, `docker compose up --build` starts the database, the API (`5161`) and the client (`3000`) wired together. Open http://localhost:3000.
- **Client only:** `docker compose up --build` in `Client/` defaults `API_URL` to `http://localhost:5161`. Inside a container `localhost` is the container itself, so point it at the host (for example `http://host.docker.internal:5161`) or use the root compose file.
- Terminate TLS in front of the container, as with the API.

## Architecture

### Feature folders

The app is **feature-driven**. Each feature owns a folder under `src/features/` and holds everything it needs.

```
src/
  index.ts / index.html / frontend.tsx   server + proxy, HTML shell, React entry
  routes/__root.tsx                      app shell (side nav and the page)
  routeTree.ts                           composes each feature's routes
  features/<feature>/
    api/<controller>.queries.ts          every API call for one backend controller
    hooks/use<Thing>.ts                  one hook per file
    components/                          used only by this feature
    pages/                               route components (thin)
    routes.ts                            this feature's routes
    index.ts                             the feature's public surface
  components/                            shared app components (+ ui/ for shadcn primitives)
  lib/                                   shared helpers (+ api/ for the generated client)
```

Rules:

1. New functionality goes in its feature (or a new one). Do not add feature code to `components/`.
2. **Features never reach into each other.** They import another feature only through its `index.ts`. Anything two features need moves to `components/` or `lib/`.
3. **Shared code never imports from a feature.**
4. Routes belong to features, and `routeTree.ts` only composes them. Pages stay thin: they compose hooks and components.

### API layering

Server access has four layers, and each talks only to the one below:

1. **`lib/api`**: the generated client.
2. **`*.queries.ts`**: one per backend controller. The only place a feature calls the generated client. Holds the requests, the query-key factory and the `queryOptions`.
3. **Hooks**: one per file, wrapping `useQuery` or `useMutation`, including invalidation through the key factory.
4. **Components and pages**: use hooks only. They never import a queries file or build query keys. (Importing generated *types* is fine.)

Errors are handled through the query's `error` state in the component. `lib/problem.ts` turns a problem response into messages for `ErrorList`.

### Why it is built this way

| Decision | Reason |
| --- | --- |
| **Same-origin `/api` proxy** | No CORS, no environment-specific URLs in the browser, and the self-signed dev certificate stays a server concern |
| **Generated SDK, committed** | Types always match the server, and the build needs no running API |
| **Query keys built from shared roots** (`lib/queryKeys.ts`) | Stock, availability and the shopping list depend on each other. Features invalidate them together through `invalidateStockDependents` without importing one another |
| **Page state lives in the URL** (`?q=`, `?page=`, `?week=`, `?dietary=`) | Back, forward, refresh and shared links keep the view |
| **Code-based routes** | Bun has no file-route plugin |
| **`@tanstack/react-router` pinned to `1.140.0`** | Newer versions have a circular import that crashes Bun's dev bundler. Re-test `bun dev` before upgrading |
| **Dates are `YYYY-MM-DD` strings handled with `lib/dates.ts`** | Calendar days, local time, no UTC shifting. Avoid very new built-ins (the app has to work on older phones) |
| **Containers, not screens, drive the calendar layout** | The side nav takes width, so the week grid and list switch on the calendar's own width (`@container`) |

## Features

### Calendar (`schedules`, home page `/`)

A weekly calendar (`?week=YYYY-MM-DD`, weeks start on Monday) showing every planned recipe as a card, in a grid on wide containers and a stacked list on narrow ones.

- **Stock colour and tag:** green *Ready*, yellow *Some missing*, coral *Missing*, from the server's per-meal availability. Every state has an icon and a label, so colour is never the only signal.
- **Quick actions:** a check button completes the meal (the server takes the ingredients out of stock) and Undo returns a done or skipped meal to pending. Completing refreshes the week, so the colours of later meals update.
- **Done and skipped** meals show a muted card with a tag instead of a stock colour.
- **Recipe dialog:** clicking a card shows the recipe, the stock state of each ingredient, a quick *Add stock* for anything lacking, and Complete, Skip or Undo.
- **Week progress:** a "3 of 8 done" tag in the header (skipped meals are left out of the total).

### Inventory (`/inventory`)

A searchable, paged table of what you have. Edit sets a quantity, *Used up* removes the item and *Add stock* adds to what is there (the server merges units). Quantities are shown with `formatQuantity` (`lib/quantity.ts`).

### Shopping list (`/shopping-list`)

Reads the server's shopping list for the selected week: **To buy**, **Covered**, and **In stock, not planned**. Ticking an item adds the missing amount to stock, and the row moves to Covered when the list refreshes, so there is no separate "checked" state. Un-ticking is done on the inventory page. Items whose stock is in a unit that cannot be compared link to inventory to fix it.

### Recipes (`/recipes`) and ingredients (`/ingredients`)

Searchable, paged lists (recipes also filter by dietary requirement). Each page has a "New" dialog; the recipe form uses an ingredient combobox that can add a missing ingredient on the spot.

## UI and brand

Everything is driven by semantic tokens in `styles/globals.css`: use `bg-primary`, `text-foreground` and friends, never hard-coded hex, white or black. Nosh Green leads, Charcoal is for backgrounds and text, Coral and Leaf are small accents. Aim for AA contrast, tap targets of at least 40px, and body text of at least 16px so it works on small, older phones. The full palette and rules are in [`Agent.md`](Agent.md).
