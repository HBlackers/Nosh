import type { ReactNode } from "react";

type AppLayoutProps = {
  nav: ReactNode;
  aside: ReactNode;
  children: ReactNode;
};

export function AppLayout({ nav, aside, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[14rem_minmax(0,1fr)_18rem]">
      <header className="bg-nosh-charcoal text-cloud-grey lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">{nav}</header>
      <main className="min-w-0 p-4 md:p-6">{children}</main>
      <aside className="border-t bg-card p-4 md:p-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-l lg:border-t-0">
        {aside}
      </aside>
    </div>
  );
}
