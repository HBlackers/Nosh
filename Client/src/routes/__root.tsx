import type { QueryClient } from "@tanstack/react-query";
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <div className="min-h-screen">
      <header className="bg-nosh-charcoal text-cloud-grey">
        <nav className="container mx-auto flex items-center gap-8 p-4">
          <Link to="/" aria-label="Nosh home">
            <Logo />
          </Link>
          <Link to="/" className="hover:text-nosh-green [&.active]:text-nosh-green">
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
