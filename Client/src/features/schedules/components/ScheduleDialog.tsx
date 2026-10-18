import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScheduleForm, type ScheduleDefaults } from "./ScheduleForm";

type ScheduleDialogProps = {
  trigger: ReactNode;
  defaults: ScheduleDefaults;
};

export function ScheduleDialog({ trigger, defaults }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90dvh]">
        <ScheduleForm
          defaults={defaults}
          onCreated={date => {
            setOpen(false);
            void navigate({ to: "/", search: { week: date } });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
