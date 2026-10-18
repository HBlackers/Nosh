import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAccessibility } from "../hooks/useAccessibility";
import { AccessibilityForm } from "./AccessibilityForm";

export function AccessibilityGate() {
  const { configured } = useAccessibility();

  return (
    <Dialog open={!configured}>
      <DialogContent hideClose onInteractOutside={event => event.preventDefault()} onEscapeKeyDown={event => event.preventDefault()}>
        <AccessibilityForm firstVisit />
      </DialogContent>
    </Dialog>
  );
}
