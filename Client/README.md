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

A weekly calendar (`?week=YYYY-MM-DD`, weeks start on Monday) showing every planned recipe as a card, in a grid on wide containers and a stacked list on narrow ones (each day has a tab for each meal, so only one meal's recipes show at a time).

- **Stock colour and tag:** green *Ready*, yellow *Some missing*, coral *Missing*, from the server's per-meal availability. Every state has an icon and a label, so colour is never the only signal.
- **Quick actions:** a check button completes the meal (the server takes the ingredients out of stock) and Undo returns a done or skipped meal to pending. Completing refreshes the week, so the colours of later meals update.
- **Done and skipped** meals show a muted card with a tag instead of a stock colour.
- **Recipe dialog:** clicking a card shows the recipe, the stock state of each ingredient, a quick *Add stock* for anything lacking, and Complete, Skip or Undo.
- **Week progress:** a "3 of 8 done" tag in the header (skipped meals are left out of the total).

### Inventory (`/inventory`)

A searchable, paged table of what you have. Edit sets a quantity, *Used up* removes the item and *Add stock* adds to what is there (the server merges units). Quantities are shown with `formatQuantity` (`lib/quantity.ts`).

### Shopping list (`/shopping-list`)

Reads the server's shopping list for the selected week: **To buy**, **Covered**, and **In stock, not planned**. Ticking an item adds the missing amount to stock, and the row moves to Covered when the list refreshes, so there is no separate "checked" state. Un-ticking is done on the inventory page. Items whose stock is in a unit that cannot be compared link to inventory to fix it.

### Diet and accessibility (nav buttons at the bottom)

- **Diet** opens the saved dietary requirements, which recipes, starter recipes and the planning picker start filtered by. A new visitor sees it first, before anything else.
- **Accessibility** is also the very first dialog a new visitor sees, with the usual settings already picked, followed by the Diet dialog and then the recipes page. It lets a person change the **text size** (Smaller, Normal, Large, Larger, Largest; Normal is the default) and switch the whole app to a **dyslexia-friendly font** (OpenDyslexic). and turn on **read aloud**, with a UK English voice and a speed of their choice. Everything is saved on that device and applies straight away on the next visit, and the whole page scales with the text size. The font files are only downloaded when someone asks for them. Read aloud adds a button to recipes (with a button to read from any step), to a meal's dialog on the calendar and to the shopping list; it reads content only, never buttons or menus, and when it is off none of those buttons appear.

### Recipes (`/recipes`) and ingredients (`/ingredients`)

Searchable, paged lists (recipes also filter by dietary requirement). Each page has a "New" dialog; the recipe form uses an ingredient combobox that can add a missing ingredient on the spot.

## UI and brand

The look comes from the Project Nosh brand slide and lives in `styles/globals.css` as semantic tokens: use `bg-primary`, `text-foreground` and friends, never hard-coded hex, white or black. The full palette and the rules for using it are in [`Agent.md`](Agent.md).

| Area | The rule |
| --- | --- |
| **Logo** | Only on Nosh Charcoal or white, with clear space of at least the width of the "O". Never recolour, stretch, rotate or add effects. |
| **Colour** | Nosh Green `#62CC9B` leads. Deep Teal `#3AA58F` and Nosh Charcoal `#2E373E` support. Flame Coral `#F3764B` and Leaf `#D5C52D` are small accents (highlights, badges, warnings). Cloud Grey `#B7BFC0` is muted text on dark. |
| **Type** | Nunito Bold headings (Arial fallback), Nunito Sans or the system sans for body. |
| **Voice** | Warm and practical, never preachy or judgemental about budgets. Plain words, short sentences, no jargon, no guilt. |
| **Accessibility** | WCAG AA minimum, and it must work well on older, smaller phones. |

### Accessibility and older phones

Nosh serves people on older, smaller phones, so **WCAG 2.1 AA is the minimum**. In practice that means:

- **Text contrast:** 4.5:1 for normal text and 3:1 for large text, in both the light and dark themes. Text on a brand colour is Charcoal, never white.
- **Control edges and icons:** the border of an input, select or outlined button, and any icon that tells people they can act, needs 3:1. Decorative borders can be lighter. Never fade a meaningful icon to make it look quiet.
- **Not just colour:** the calendar's green, yellow and coral stock status also has an icon and a label.
- **Touch first:** tap targets of at least 40px, all text at least 16px (no `text-sm` or `text-xs`), and a layout that works at 320px and 375px wide without sideways scrolling. Design the phone view first.
- **Hover and focus:** hover uses `hover:brightness-105` or a solid token, never opacity or a transparent tint (focus rings are solid too), and nothing works by hover alone. Everything works by tap and by keyboard, with a visible focus ring and proper labels.
- **Older browsers:** avoid very new JavaScript built-ins and check CSS features before using them.
- **Light pages:** no heavy dependencies or large images.

The numbered rules and a checklist for finishing UI work are in [`Agent.md`](Agent.md#accessibility-and-small-phones). To check your own work, view the page at phone width (the browser pane's Mobile preset works), tab through it, and look at it in the dark theme.
