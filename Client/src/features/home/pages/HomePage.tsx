import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HomePage() {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-4xl">Plan meals without the stress</h1>
      <p className="text-muted-foreground text-lg">Warm, practical and judgement-free.</p>
      <Card>
        <CardHeader>
          <CardTitle>Theme preview</CardTitle>
          <CardDescription>
            Edit <code className="font-mono">src/features/home</code>. Colour rules live in{" "}
            <code className="font-mono">Agent.md</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Remove</Button>
          <Button variant="link">Link</Button>
        </CardContent>
      </Card>
    </div>
  );
}
