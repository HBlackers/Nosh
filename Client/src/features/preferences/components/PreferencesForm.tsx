import { type FormEvent, useState } from "react";
import { ErrorList } from "@/components/ErrorList";
import { FilterTabs } from "@/components/FilterTabs";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { DietaryRequirement, UserPreferenceResponse } from "@/lib/api/generated";
import { DIETARY_REQUIREMENTS, humanize } from "@/lib/enums";
import { problemMessages } from "@/lib/problem";
import { useSavePreference } from "../hooks/useSavePreference";

const options = DIETARY_REQUIREMENTS.map(value => ({ value, label: humanize(value) }));

type PreferencesFormProps = {
  existing: UserPreferenceResponse | null;
  firstVisit: boolean;
  onSaved: () => void;
};

export function PreferencesForm({ existing, firstVisit, onSaved }: PreferencesFormProps) {
  const [dietary, setDietary] = useState<DietaryRequirement[]>(existing?.dietary ?? []);
  const save = useSavePreference(onSaved);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate({ existing, dietary });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>{firstVisit ? "Welcome to Nosh" : "Your dietary preferences"}</DialogTitle>
        <DialogDescription>
          {firstVisit
            ? "Tell us how you like to eat and we'll show you recipes that suit you. You can change this any time."
            : "We'll show you recipes that suit these. Pick as many as you like, or none."}
        </DialogDescription>
      </DialogHeader>

      <FilterTabs label="I eat" options={options} selected={dietary} onChange={setDietary} showAll={false} />

      <p className="text-base text-muted-foreground">Nothing to pick? That's fine, just carry on.</p>

      {save.isError && <ErrorList messages={problemMessages(save.error)} />}

      <DialogFooter>
        {!firstVisit && (
          <DialogClose asChild>
            <Button type="button" variant="outline" size="lg">
              Cancel
            </Button>
          </DialogClose>
        )}
        <Button type="submit" size="lg" disabled={save.isPending}>
          {save.isPending ? "Saving…" : firstVisit ? "Continue" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}
