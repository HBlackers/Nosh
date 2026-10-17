import type { CreateClientConfig } from "./generated/client.gen";

// Relative: src/index.ts proxies /api/* to the server, so the browser stays same-origin.
export const API_BASE_URL = "/api";

export const createClientConfig: CreateClientConfig = config => ({
  ...config,
  baseUrl: API_BASE_URL,
  // Throw on non-2xx so TanStack Query surfaces failures as `error`.
  throwOnError: true,
});
