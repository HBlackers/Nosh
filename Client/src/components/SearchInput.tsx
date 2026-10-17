import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

type SearchInputProps = {
  value: string;
  onSearch: (value: string) => void;
  label: string;
  placeholder?: string;
};

export function SearchInput({ value, onSearch, label, placeholder }: SearchInputProps) {
  const [text, setText] = useState(value);
  const lastSent = useRef(value);
  const query = useDebouncedValue(text, 300).trim();

  useEffect(() => {
    if (query !== lastSent.current) {
      lastSent.current = query;
      onSearch(query);
    }
  }, [query, onSearch]);

  useEffect(() => {
    if (value !== lastSent.current) {
      lastSent.current = value;
      setText(value);
    }
  }, [value]);

  return (
    <div className="relative">
      <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={text}
        onChange={event => setText(event.target.value)}
        className="h-10 pl-9"
      />
    </div>
  );
}
