import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreference } from "@/features/preferences";
import { humanize } from "@/lib/enums";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { cn } from "@/lib/utils";
import { useRecipes } from "../hooks/useRecipes";

export type RecipeOption = { id: string; name: string };

type RecipeComboboxProps = {
  value: RecipeOption | null;
  onChange: (value: RecipeOption | null) => void;
  label: string;
};

export function RecipeCombobox({ value, onChange, label }: RecipeComboboxProps) {
  const listId = useId();
  const [text, setText] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const search = useDebouncedValue(text.trim(), 250);
  const preference = usePreference();

  const dietary = preference.data?.dietary ?? [];
  const suitable = !showAll && dietary.length > 0;
  const { data } = useRecipes(
    { name: search || undefined, dietary: suitable ? dietary : [], page: 1, pageSize: 8 },
    { enabled: open && preference.isSuccess },
  );

  const items = data?.items ?? [];

  const choose = (option: RecipeOption) => {
    onChange(option);
    setText(option.name);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive(Math.min(active + 1, Math.max(items.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(Math.max(active - 1, 0));
    } else if (event.key === "Enter" && open && items[active]) {
      event.preventDefault();
      choose(items[active]);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && items.length > 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        placeholder="Search your recipes"
        value={text}
        onChange={event => {
          setText(event.target.value);
          setActive(0);
          setOpen(true);
          if (value) {
            onChange(null);
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className={cn("h-10", value && "border-primary")}
      />

      {dietary.length > 0 && (
        <Button
          type="button"
          variant={suitable ? "default" : "outline"}
          aria-pressed={suitable}
          className="h-10"
          onClick={() => setShowAll(!showAll)}
          onMouseDown={event => event.preventDefault()}
        >
          {suitable ? `Only ${dietary.map(requirement => humanize(requirement).toLowerCase()).join(" and ")}` : "Showing all my recipes"}
        </Button>
      )}

      {open && items.length > 0 && (
        <ul id={listId} role="listbox" aria-label={`${label} suggestions`} className="rounded-lg border bg-card p-1 text-sm">
          {items.map((item, index) => (
            <li
              key={item.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              onMouseDown={event => event.preventDefault()}
              onClick={() => choose({ id: item.id, name: item.name })}
              className={cn("cursor-pointer rounded-md px-3 py-2.5", index === active && "bg-accent")}
            >
              <span className="font-semibold">{item.name}</span>
              <span className="ml-2 text-muted-foreground">{item.mealTypes.join(", ")}</span>
            </li>
          ))}
        </ul>
      )}

      {open && data && items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {suitable ? "No recipes that suit you match. Try showing all your recipes." : "No recipes match. Add one on the Recipes page first."}
        </p>
      )}
    </div>
  );
}
