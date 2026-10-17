import { defineConfig } from "@hey-api/openapi-ts";

// Generates the typed API client into src/lib/api/generated from the ASP.NET server's OpenAPI document.
// Start the server (dotnet run in ../Server) then `bun run generate:api`.
// Set OPENAPI_URL to read from somewhere else (a file path works too).
export default defineConfig({
  input: process.env.OPENAPI_URL ?? "http://localhost:5161/openapi/v1.json",
  output: { path: "src/lib/api/generated", clean: true },
  plugins: [
    "@hey-api/typescript",
    "@hey-api/sdk",
    { name: "@hey-api/client-fetch", runtimeConfigPath: "@/lib/api/client" },
  ],
});
