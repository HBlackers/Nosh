import { serve } from "bun";
import index from "./index.html";

const API_URL = process.env.API_URL ?? "https://localhost:7263";
// Locally the API runs over HTTPS with the self-signed .NET development certificate, so accept it outside production.
const allowSelfSigned = process.env.NODE_ENV !== "production";

const server = serve({
  port: Number(process.env.PORT ?? 3000),
  routes: {
    "/api/*": req => {
      const url = new URL(req.url);
      const target = new URL(url.pathname.replace(/^\/api/, "") + url.search, API_URL);
      return fetch(new Request(target, req), { tls: { rejectUnauthorized: !allowSelfSigned } }).catch(
        () => new Response("API unavailable", { status: 502 }),
      );
    },

    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
