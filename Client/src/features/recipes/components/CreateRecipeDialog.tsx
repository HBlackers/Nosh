import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RecipeForm } from "./RecipeForm";

export function CreateRecipeDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus aria-hidden="true" />
          New recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <RecipeForm onCreated={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
