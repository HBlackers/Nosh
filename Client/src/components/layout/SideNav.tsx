import { Link } from "@tanstack/react-router";
import { BookOpen, CalendarDays, Carrot, Menu, Package, ShoppingBasket, X } from "lucide-react";
import { type ReactNode, useEffect, useId, useState } from "react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const items = [
  { label: "Calendar", icon: CalendarDays, to: "/" },
  { label: "Shopping list", icon: ShoppingBasket, to: "/shopping-list" },
  { label: "Recipes", icon: BookOpen, to: "/recipes" },
  { label: "Ingredients", icon: Carrot, to: "/ingredients" },
  { label: "Inventory", icon: Package, to: "/inventory" },
] as const;

export function SideNav({ footer }: { footer?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    // Past the lg breakpoint the nav is the sidebar again, so there is no menu to leave open.
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onResize = () => desktop.matches && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <div
      className={cn(
        "flex flex-col p-4 lg:min-h-full lg:gap-6 lg:p-6",
        open && "max-lg:fixed max-lg:inset-0 max-lg:overflow-y-auto max-lg:bg-nosh-charcoal",
      )}
    >
      <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center lg:block">
        <span aria-hidden="true" className="lg:hidden" />
        <Link to="/" aria-label="Nosh home" onClick={() => setOpen(false)} className="justify-self-center lg:justify-self-auto">
          <Logo variant="full" className="w-28 lg:w-44" />
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(!open)}
          className="flex size-10 items-center justify-center rounded-lg text-cloud-grey hover:bg-charcoal-raised hover:text-nosh-green focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none lg:hidden"
        >
          {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </div>

      <div id={menuId} className={cn("flex-1 flex-col gap-3 pt-6 lg:flex lg:gap-6 lg:pt-0", open ? "flex" : "hidden")}>
        <nav aria-label="Main">
          <ul className="flex flex-col gap-1">
            {items.map(({ label, icon: Icon, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact: true, includeSearch: false }}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center gap-4 rounded-lg px-3 py-2.5 text-xl font-semibold text-cloud-grey hover:bg-charcoal-raised hover:text-nosh-green data-[status=active]:bg-charcoal-raised data-[status=active]:text-nosh-green lg:min-h-11 lg:gap-3 lg:text-base"
                >
                  <Icon className="size-6 lg:size-5" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {footer && (
          <div onClick={() => setOpen(false)} className="mt-auto">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
