import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Occurrence } from "../calendar";
import { occurrenceStatus } from "./occurrenceStatus";

export function OccurrenceStatusTag({ occurrence }: { occurrence: Occurrence }) {
  const { label, icon: Icon, tag } = occurrenceStatus(occurrence);
  return (
    <Badge className={cn("px-2 text-xs", tag)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </Badge>
  );
}
