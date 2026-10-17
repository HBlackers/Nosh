import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { problemMessages } from "@/lib/problem";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useCreateIngredient } from "../hooks/useCreateIngredient";
import { useIngredients } from "../hooks/useIngredients";

export type IngredientOption = { id: string; name: string };

type IngredientComboboxProps = {
  value: IngredientOption | null;
  onChange: (value: IngredientOption | null) => void;
  label: string;
};

export function IngredientCombobox({ value, onChange, label }: IngredientComboboxProps) {
  const listId = useId();
  const [text, setText] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const search = useDebouncedValue(text.trim(), 250);
  const { data } = useIngredients({ name: search || undefined, page: 1, pageSize: 8 }, { enabled: open });
  const create = useCreateIngredient();

  const items = data?.items ?? [];
  const typed = text.trim();
  const canCreate = typed !== "" && !items.some(item => item.name.toLowerCase() === typed.toLowerCase());
  const optionCount = items.length + (canCreate ? 1 : 0);

  const choose = (option: IngredientOption) => {
    onChange(option);
    setText(option.name);
    setOpen(false);
  };

  const createAndChoose = () => create.mutate(typed, { onSuccess: ingredient => choose({ id: ingredient.id, name: ingredient.name }) });

  const pick = (index: number) => {
    const item = items[index];
    if (item) {
      choose({ id: item.id, name: item.name });
    } else {
      createAndChoose();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive(Math.min(active + 1, Math.max(optionCount - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(Math.max(active - 1, 0));
    } else if (event.key === "Enter" && open && optionCount > 0) {
      event.preventDefault();
      pick(active);
    }
  };

  return (
    <div className="space-y-1">
      <Input
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && optionCount > 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        placeholder="Search or add an ingredient"
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

      {open && optionCount > 0 && (
        <ul id={listId} role="listbox" aria-label={`${label} suggestions`} className="rounded-lg border bg-card p-1 text-sm">
          {items.map((item, index) => (
            <li
              key={item.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              onMouseDown={event => event.preventDefault()}
              onClick={() => pick(index)}
              className={cn("cursor-pointer rounded-md px-3 py-2.5", index === active && "bg-accent")}
            >
              {item.name}
            </li>
          ))}
          {canCreate && (
            <li
              id={`${listId}-${items.length}`}
              role="option"
              aria-selected={active === items.length}
              onMouseDown={event => event.preventDefault()}
              onClick={createAndChoose}
              className={cn("cursor-pointer rounded-md px-3 py-2.5 font-semibold", active === items.length && "bg-accent")}
            >
              Add "{typed}" as a new ingredient
            </li>
          )}
        </ul>
      )}

      {create.isError && (
        <p role="alert" className="text-sm">
          {problemMessages(create.error)[0]}
        </p>
      )}
    </div>
  );
}
