import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ErrorList } from "@/components/ErrorList";
import { Button } from "@/components/ui/button";
import type { RecipeOption } from "@/features/recipes";
import type { ScheduleResponse } from "@/lib/api/generated";
import { toISODate } from "@/lib/dates";
import { problemMessages } from "@/lib/problem";
import { useDeleteSchedule } from "../hooks/useDeleteSchedule";
import { useRecipeSchedules } from "../hooks/useRecipeSchedules";
import { describeSchedule } from "../scheduleOptions";
import { ScheduleForm } from "./ScheduleForm";

type Mode = { kind: "list" } | { kind: "new" } | { kind: "edit"; schedule: ScheduleResponse };

export function RecipeSchedulesPanel({ recipe }: { recipe: RecipeOption }) {
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const { data, isPending, isError, refetch } = useRecipeSchedules(recipe.id);
  const back = () => setMode({ kind: "list" });

  if (mode.kind !== "list") {
    return (
      <ScheduleForm
        defaults={{ date: toISODate(new Date()) }}
        schedule={mode.kind === "edit" ? mode.schedule : undefined}
        recipe={recipe}
        onSaved={back}
        onCancel={back}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground">Where this recipe is planned on your calendar.</p>
        <Button size="lg" onClick={() => setMode({ kind: "new" })}>
          <Plus aria-hidden="true" />
          Plan this recipe
        </Button>
      </div>

      {isPending && <p className="text-muted-foreground">Loading schedules…</p>}

      {isError && (
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <p>We couldn't load the schedules. Please try again.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {data && data.items.length === 0 && <p className="rounded-xl border bg-card p-4">Not planned yet. Plan it to see it on your calendar.</p>}

      {data && data.items.length > 0 && (
        <ul className="divide-y rounded-xl border bg-card">
          {data.items.map(schedule => (
            <ScheduleRow key={schedule.id} schedule={schedule} onEdit={() => setMode({ kind: "edit", schedule })} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ScheduleRow({ schedule, onEdit }: { schedule: ScheduleResponse; onEdit: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const remove = useDeleteSchedule();
  const { when, range } = describeSchedule(schedule);

  return (
    <li className="space-y-2 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{when}</p>
          <p className="text-base text-muted-foreground">{range}</p>
        </div>

        {confirming ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base">Remove it from the calendar?</span>
            <Button variant="destructive" size="lg" disabled={remove.isPending} onClick={() => remove.mutate(schedule.id)}>
              {remove.isPending ? "Removing…" : "Yes, remove"}
            </Button>
            <Button variant="outline" size="lg" onClick={() => setConfirming(false)}>
              Keep
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="lg" onClick={onEdit} aria-label={`Change schedule: ${when}`}>
              <Pencil aria-hidden="true" />
              Change
            </Button>
            <Button variant="outline" size="lg" onClick={() => setConfirming(true)} aria-label={`Delete schedule: ${when}`}>
              <Trash2 aria-hidden="true" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {remove.isError && <ErrorList messages={problemMessages(remove.error)} />}
    </li>
  );
}
