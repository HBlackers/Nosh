import { useId } from "react";
import { cn } from "@/lib/utils";

type TabsProps<T extends string> = {
  label: string;
  tabs: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  // Pass the same id to tabIds() to link each panel to its tab; without it the tabs still work but aren't linked.
  id?: string;
};

export function tabIds(base: string, id: string) {
  return { tab: `${base}-tab-${id}`, panel: `${base}-panel-${id}` };
}

export function Tabs<T extends string>({ label, tabs, value, onChange, id }: TabsProps<T>) {
  const generated = useId();
  const base = id ?? generated;

  return (
    <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b">
      {tabs.map(tab => {
        const selected = tab.id === value;
        const ids = tabIds(base, tab.id);
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={ids.tab}
            aria-selected={selected}
            aria-controls={ids.panel}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={event => {
              const next = tabs[(tabs.findIndex(t => t.id === value) + (event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0) + tabs.length) % tabs.length];
              if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && next) {
                onChange(next.id);
              }
            }}
            className={cn(
              "-mb-px flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
              selected ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="min-w-6 rounded-full bg-primary px-1.5 text-center text-primary-foreground">
                {tab.count}
                <span className="sr-only"> planned</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
