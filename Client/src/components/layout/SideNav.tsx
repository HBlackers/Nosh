import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BookOpen, CalendarDays, Carrot, Package, ShoppingBasket } from "lucide-react";
import { Logo } from "@/components/Logo";

const items = [
  { label: "Calendar", icon: CalendarDays, to: "/" },
  { label: "Shopping list", icon: ShoppingBasket, to: "/shopping-list" },
  { label: "Recipes", icon: BookOpen, to: "/recipes" },
  { label: "Ingredients", icon: Carrot, to: "/ingredients" },
  { label: "Inventory", icon: Package, to: "/inventory" },
] as const;

export function SideNav({ footer }: { footer?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-4 lg:min-h-full lg:gap-6 lg:p-6">
      <Link to="/" aria-label="Nosh home" className="self-start">
        <Logo variant="full" className="w-28 lg:w-44" />
      </Link>

      <nav aria-label="Main">
        <ul className="flex flex-wrap gap-1 lg:flex-col">
          {items.map(({ label, icon: Icon, to }) => (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact: true, includeSearch: false }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-semibold text-cloud-grey hover:bg-charcoal-raised hover:text-nosh-green data-[status=active]:bg-charcoal-raised data-[status=active]:text-nosh-green"
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {footer && <div className="lg:mt-auto">{footer}</div>}
    </div>
  );
}
