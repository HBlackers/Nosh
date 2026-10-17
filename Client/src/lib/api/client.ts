import type { CreateClientConfig } from "./generated/client.gen";

// API client setup: the one place for base URL, auth and request/response handling.
// The generated client calls createClientConfig when it is created (see openapi-ts.config.ts).

/** Relative, so the browser stays same-origin; src/index.ts proxies /api/* to the ASP.NET server. */
export const API_BASE_URL = "/api";

export const createClientConfig: CreateClientConfig = config => ({
  ...config,
  baseUrl: API_BASE_URL,
  // Throw on non-2xx so TanStack Query surfaces failures as `error`.
  throwOnError: true,
  // Auth goes here, e.g. auth: () => getAccessToken()
});
