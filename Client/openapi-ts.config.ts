import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: process.env.OPENAPI_URL ?? "https://localhost:7263/openapi/v1.json",
  output: { path: "src/lib/api/generated", clean: true },
  plugins: [
    "@hey-api/typescript",
    "@hey-api/sdk",
    { name: "@hey-api/client-fetch", runtimeConfigPath: "@/lib/api/client" },
  ],
});
