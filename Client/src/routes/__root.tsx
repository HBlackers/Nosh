import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SideNav } from "@/components/layout/SideNav";
import { PreferencesButton, PreferencesGate } from "@/features/preferences";

export const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <AppLayout nav={<SideNav footer={<PreferencesButton />} />}>
      <Outlet />
      <PreferencesGate />
    </AppLayout>
  ),
});
