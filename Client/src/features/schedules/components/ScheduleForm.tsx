import { type FormEvent, useState } from "react";
import { ErrorList } from "@/components/ErrorList";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecipeCombobox, type RecipeOption } from "@/features/recipes";
import type { DayOfWeek, MealType, RecurrenceFrequency } from "@/lib/api/generated";
import type { ISODate } from "@/lib/dates";
import { MEAL_TYPES } from "@/lib/enums";
import { problemMessages } from "@/lib/problem";
import { cn } from "@/lib/utils";
import { useCreateSchedule } from "../hooks/useCreateSchedule";
import { FREQUENCIES, WEEK_DAYS, dayOfWeekOf } from "../scheduleOptions";

export type ScheduleDefaults = {
  date: ISODate;
  mealType?: MealType;
  frequency?: RecurrenceFrequency;
};

type EndMode = "never" | "date" | "count";

type ScheduleFormProps = {
  defaults: ScheduleDefaults;
  onCreated: (date: ISODate) => void;
};

export function ScheduleForm({ defaults, onCreated }: ScheduleFormProps) {
  const [recipe, setRecipe] = useState<RecipeOption | null>(null);
  const [date, setDate] = useState<ISODate>(defaults.date);
  const [mealType, setMealType] = useState<MealType | "">(defaults.mealType ?? "");
  const [frequency, setFrequency] = useState<RecurrenceFrequency | "">(defaults.frequency ?? "");
  const [interval, setInterval] = useState("1");
  const [days, setDays] = useState<DayOfWeek[]>([]);
  const [endMode, setEndMode] = useState<EndMode>("never");
  const [endDate, setEndDate] = useState("");
  const [count, setCount] = useState("4");
  const create = useCreateSchedule();

  const repeats = frequency !== "" && frequency !== "None";
  const unit = FREQUENCIES.find(option => option.value === frequency)?.unit ?? "";

  const canSubmit =
    recipe !== null &&
    date !== "" &&
    mealType !== "" &&
    frequency !== "" &&
    (!repeats ||
      (Number(interval) >= 1 &&
        (frequency !== "Weekly" || days.length > 0) &&
        (endMode !== "date" || (endDate !== "" && endDate >= date)) &&
        (endMode !== "count" || Number(count) >= 1)));

  const changeFrequency = (next: RecurrenceFrequency) => {
    setFrequency(next);
    if (next === "Weekly" && days.length === 0 && date !== "") {
      setDays([dayOfWeekOf(date)]);
    }
  };

  const toggleDay = (day: DayOfWeek) => setDays(days.includes(day) ? days.filter(d => d !== day) : [...days, day]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (recipe === null || mealType === "" || frequency === "" || !canSubmit) {
      return;
    }
    create.mutate(
      {
        recipeId: recipe.id,
        startDate: date,
        mealType,
        frequency,
        interval: repeats ? Number(interval) : 1,
        daysOfWeek: frequency === "Weekly" ? days : [],
        endDate: repeats && endMode === "date" ? endDate : null,
        maxOccurrences: repeats && endMode === "count" ? Number(count) : null,
      },
      { onSuccess: () => onCreated(date) },
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Plan a recipe</DialogTitle>
        <DialogDescription>Choose a recipe, when to have it, and whether it repeats.</DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Label>Recipe</Label>
        <RecipeCombobox value={recipe} onChange={setRecipe} label="Recipe" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="schedule-date">Date</Label>
          <Input id="schedule-date" type="date" value={date} onChange={event => setDate(event.target.value)} className="h-10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="schedule-meal">Meal</Label>
          <Select value={mealType} onValueChange={value => setMealType(value as MealType)}>
            <SelectTrigger id="schedule-meal" className="h-10 w-full">
              <SelectValue placeholder="Choose a meal" />
            </SelectTrigger>
            <SelectContent>
              {MEAL_TYPES.map(meal => (
                <SelectItem key={meal} value={meal}>
                  {meal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule-repeat">How often</Label>
        <Select value={frequency} onValueChange={value => changeFrequency(value as RecurrenceFrequency)}>
          <SelectTrigger id="schedule-repeat" className="h-10 w-full">
            <SelectValue placeholder="Choose how often" />
          </SelectTrigger>
          <SelectContent>
            {FREQUENCIES.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {repeats && (
        <div className="space-y-4 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="schedule-interval">Every</Label>
            <Input
              id="schedule-interval"
              type="number"
              min={1}
              value={interval}
              onChange={event => setInterval(event.target.value)}
              className="h-10 w-20"
            />
            <span>{unit}</span>
          </div>

          {frequency === "Weekly" && (
            <div role="group" aria-label="On these days" className="flex flex-wrap gap-2">
              {WEEK_DAYS.map(day => (
                <Button
                  key={day.value}
                  type="button"
                  className="h-10"
                  variant={days.includes(day.value) ? "default" : "outline"}
                  aria-pressed={days.includes(day.value)}
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="schedule-end">Ends</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={endMode} onValueChange={value => setEndMode(value as EndMode)}>
                <SelectTrigger id="schedule-end" className={cn("h-10", endMode === "never" ? "w-full" : "w-44")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="date">On a date</SelectItem>
                  <SelectItem value="count">After a number of times</SelectItem>
                </SelectContent>
              </Select>
              {endMode === "date" && (
                <Input type="date" aria-label="End date" value={endDate} min={date} onChange={event => setEndDate(event.target.value)} className="h-10 w-44" />
              )}
              {endMode === "count" && (
                <>
                  <Input type="number" aria-label="Number of times" min={1} value={count} onChange={event => setCount(event.target.value)} className="h-10 w-20" />
                  <span>times</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {create.isError && <ErrorList messages={problemMessages(create.error)} />}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" size="lg" disabled={!canSubmit || create.isPending}>
          {create.isPending ? "Planning…" : "Plan it"}
        </Button>
      </DialogFooter>
    </form>
  );
}
