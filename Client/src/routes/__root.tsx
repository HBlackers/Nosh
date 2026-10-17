import type { QueryClient } from "@tanstack/react-query";
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";

export const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto flex items-center gap-6 p-4">
          <span className="font-semibold">Nosh</span>
          <Link to="/" className="text-muted-foreground [&.active]:text-foreground">
            Home
          </Link>
        </nav>
      </header>
      <main className="container mx-auto p-8">
        <Outlet />
      </main>
    </div>
  ),
});
