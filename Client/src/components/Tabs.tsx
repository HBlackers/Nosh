import { useId } from "react";
import { cn } from "@/lib/utils";

type TabsProps<T extends string> = {
  label: string;
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function tabIds(base: string, id: string) {
  return { tab: `${base}-tab-${id}`, panel: `${base}-panel-${id}` };
}

export function Tabs<T extends string>({ label, tabs, value, onChange }: TabsProps<T>) {
  const base = useId();

  return (
    <div role="tablist" aria-label={label} className="flex gap-1 border-b">
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
              "-mb-px min-h-11 border-b-2 px-4 py-2 font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              selected ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
