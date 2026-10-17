import { Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { ErrorList } from "@/components/ErrorList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { problemMessages } from "@/lib/problem";
import { useCreateIngredient } from "../hooks/useCreateIngredient";

export function CreateIngredientDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus aria-hidden="true" />
          New ingredient
        </Button>
      </DialogTrigger>
      <DialogContent>
        <IngredientForm onCreated={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function IngredientForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const create = useCreateIngredient();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    create.mutate(name.trim(), { onSuccess: onCreated });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>New ingredient</DialogTitle>
        <DialogDescription>Add an ingredient you can use in your recipes.</DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Label htmlFor="ingredient-name">Name</Label>
        <Input id="ingredient-name" value={name} onChange={event => setName(event.target.value)} maxLength={200} autoComplete="off" className="h-10" />
      </div>

      {create.isError && <ErrorList messages={problemMessages(create.error)} />}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" size="lg" disabled={name.trim() === "" || create.isPending}>
          {create.isPending ? "Adding…" : "Add ingredient"}
        </Button>
      </DialogFooter>
    </form>
  );
}
