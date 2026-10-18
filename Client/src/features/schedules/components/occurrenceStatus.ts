import { Check, CircleAlert, CircleCheck, CircleX, SkipForward } from "lucide-react";
import type { Occurrence } from "../calendar";

export type OccurrenceStatus = {
  label: string;
  icon: typeof Check;
  tag: string;
  stripe: string;
  card: string;
};

const HANDLED_CARD = "bg-muted text-muted-foreground";

export function occurrenceStatus({ event, availability }: Occurrence): OccurrenceStatus {
  if (event?.status === "Completed") {
    return { label: "Done", icon: Check, tag: "bg-card text-foreground border-border", stripe: "border-border", card: HANDLED_CARD };
  }
  if (event?.status === "Skipped") {
    return { label: "Skipped", icon: SkipForward, tag: "bg-card text-foreground border-border", stripe: "border-border", card: HANDLED_CARD };
  }
  switch (availability?.status) {
    case "Partial":
      return { label: "Some missing", icon: CircleAlert, tag: "bg-leaf text-primary-foreground", stripe: "border-leaf", card: "bg-accent text-accent-foreground" };
    case "Missing":
      return { label: "Missing", icon: CircleX, tag: "bg-destructive text-destructive-foreground", stripe: "border-destructive", card: "bg-accent text-accent-foreground" };
    default:
      return { label: "Ready", icon: CircleCheck, tag: "bg-primary text-primary-foreground", stripe: "border-primary", card: "bg-accent text-accent-foreground" };
  }
}
