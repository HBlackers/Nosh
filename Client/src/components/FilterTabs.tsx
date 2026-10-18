import { useId } from "react";
import { Button } from "@/components/ui/button";

type FilterOption<T extends string> = { value: T; label: string };

type FilterTabsProps<T extends string> = {
  label: string;
  options: FilterOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
  showAll?: boolean;
};

export function FilterTabs<T extends string>({ label, options, selected, onChange, showAll = true }: FilterTabsProps<T>) {
  const labelId = useId();
  const toggle = (value: T) => onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);

  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-wrap items-center gap-2">
      <span id={labelId} className="mr-1 text-base font-semibold text-muted-foreground">
        {label}
      </span>
      {showAll && (
        <Button
          type="button"
          className="h-10"
          variant={selected.length === 0 ? "default" : "outline"}
          aria-pressed={selected.length === 0}
          onClick={() => onChange([])}
        >
          All
        </Button>
      )}
      {options.map(option => {
        const isSelected = selected.includes(option.value);
        return (
          <Button
            key={option.value}
            type="button"
            className="h-10"
            variant={isSelected ? "default" : "outline"}
            aria-pressed={isSelected}
            onClick={() => toggle(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
