import type { ReactNode } from "react";

type AppLayoutProps = {
  nav: ReactNode;
  children: ReactNode;
};

export function AppLayout({ nav, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[14rem_minmax(0,1fr)]">
      <header className="sticky top-0 z-40 bg-nosh-charcoal text-cloud-grey lg:z-auto lg:top-0 lg:h-screen lg:overflow-y-auto">{nav}</header>
      <main className="min-w-0 p-4 md:p-6">{children}</main>
    </div>
  );
}
