import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Occurrence, weekProgress } from "../calendar";

export function WeekProgress({ occurrences }: { occurrences: Occurrence[] }) {
  const { completed, skipped, total } = weekProgress(occurrences);

  if (total === 0) {
    return null;
  }

  return (
    <Badge className="px-3 py-1 text-sm">
      <Check className="size-4" aria-hidden="true" />
      {completed} of {total} done
      {skipped > 0 && <span className="font-normal"> · {skipped} skipped</span>}
    </Badge>
  );
}
