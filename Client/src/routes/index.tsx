import { createRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { rootRoute } from "./__root";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

function Home() {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Welcome to Nosh</CardTitle>
        <CardDescription>
          Bun + React + TanStack Router/Query + Tailwind + shadcn/ui. Edit{" "}
          <code className="font-mono">src/routes/index.tsx</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Get started</Button>
      </CardContent>
    </Card>
  );
}
