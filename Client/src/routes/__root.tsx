import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { SideNav } from "@/components/layout/SideNav";
import { AccessibilityButton, AccessibilityGate, useAccessibility } from "@/features/accessibility";
import { PreferencesButton, PreferencesGate } from "@/features/preferences";

// A new visitor goes through two dialogs in turn: accessibility settings first, then dietary requirements, which ends on the recipes page.
function FirstVisit() {
  const { configured } = useAccessibility();
  return configured ? <PreferencesGate /> : <AccessibilityGate />;
}

export const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <AppLayout
      nav={
        <SideNav
          footer={
            <>
              <PreferencesButton />
              <AccessibilityButton />
            </>
          }
        />
      }
    >
      <Outlet />
      <FirstVisit />
    </AppLayout>
  ),
});
