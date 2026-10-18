import { Link, getRouteApi } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CreateRecipeDialog } from "../components/CreateRecipeDialog";
import { MyRecipes } from "../components/MyRecipes";
import { StarterRecipes } from "../components/StarterRecipes";

const route = getRouteApi("/recipes");

export function RecipesPage() {
  const { view } = route.useSearch();
  const starter = view === "starter";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Recipes</h1>
        <CreateRecipeDialog />
      </div>

      <nav aria-label="Recipe lists" className="flex gap-2">
        <Button asChild variant={starter ? "outline" : "default"} className="h-10">
          <Link to="/recipes" search={{}} aria-current={starter ? undefined : "page"}>
            My recipes
          </Link>
        </Button>
        <Button asChild variant={starter ? "default" : "outline"} className="h-10">
          <Link to="/recipes" search={{ view: "starter" }} aria-current={starter ? "page" : undefined}>
            Starter recipes
          </Link>
        </Button>
      </nav>

      {starter ? <StarterRecipes /> : <MyRecipes />}
    </div>
  );
}
