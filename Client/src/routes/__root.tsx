import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SideNav } from "@/components/layout/SideNav";
import { ShoppingListPanel } from "@/features/shopping-list";

export const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <AppLayout nav={<SideNav />} aside={<ShoppingListPanel />}>
      <Outlet />
    </AppLayout>
  ),
});
