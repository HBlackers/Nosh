import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReadAloud } from "../hooks/useReadAloud";

type ReadFromHereButtonProps = {
  owner: string;
  lines: string[];
  from: number;
  label: string;
};

export function ReadFromHereButton({ owner, lines, from, label }: ReadFromHereButtonProps) {
  const { enabled, play } = useReadAloud(owner);

  if (!enabled) {
    return null;
  }

  return (
    <Button type="button" variant="outline" size="icon-lg" aria-label={label} onClick={() => play(lines, from)}>
      <Volume2 aria-hidden="true" />
    </Button>
  );
}
