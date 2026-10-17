import { Link } from "@tanstack/react-router";
import { BookOpen, CalendarDays, Carrot } from "lucide-react";
import { Logo } from "@/components/Logo";

const itemClass = "flex items-center gap-3 rounded-lg px-3 py-2.5 font-semibold text-cloud-grey";

export function SideNav() {
  return (
    <div className="flex flex-col gap-3 p-4 lg:gap-6 lg:p-6">
      <Link to="/" aria-label="Nosh home" className="self-start">
        <Logo variant="full" className="w-28 lg:w-44" />
      </Link>

      <nav aria-label="Main">
        <ul className="flex flex-wrap gap-1 lg:flex-col">
          <li>
            <Link
              to="/"
              className={`${itemClass} hover:bg-charcoal-raised hover:text-nosh-green data-[status=active]:bg-charcoal-raised data-[status=active]:text-nosh-green`}
            >
              <CalendarDays className="size-5" aria-hidden="true" />
              Calendar
            </Link>
          </li>
          <li>
            <span aria-disabled="true" className={`${itemClass} cursor-default`}>
              <BookOpen className="size-5" aria-hidden="true" />
              Recipes
            </span>
          </li>
          <li>
            <span aria-disabled="true" className={`${itemClass} cursor-default`}>
              <Carrot className="size-5" aria-hidden="true" />
              Ingredients
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
}
