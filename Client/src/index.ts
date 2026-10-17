import { serve } from "bun";
import index from "./index.html";

// Where /api/* requests are forwarded. Overridden in Docker via compose.
const API_URL = process.env.API_URL ?? "http://localhost:5161";

const server = serve({
  port: Number(process.env.PORT ?? 3000),
  routes: {
    // Forward API calls to the ASP.NET server so the browser stays same-origin.
    "/api/*": req => {
      const url = new URL(req.url);
      return fetch(new URL(url.pathname.replace(/^\/api/, "") + url.search, API_URL), req).catch(
        () => new Response("API unavailable", { status: 502 }),
      );
    },

    // Serve index.html for all unmatched routes (SPA fallback).
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
