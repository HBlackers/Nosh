import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePreference } from "../hooks/usePreference";
import { PreferencesForm } from "./PreferencesForm";

export function PreferencesGate() {
  const { data: preference, isSuccess } = usePreference();
  const navigate = useNavigate();

  return (
    <Dialog open={isSuccess && preference === null}>
      <DialogContent hideClose onInteractOutside={event => event.preventDefault()} onEscapeKeyDown={event => event.preventDefault()}>
        <PreferencesForm existing={null} firstVisit onSaved={() => void navigate({ to: "/recipes" })} />
      </DialogContent>
    </Dialog>
  );
}
