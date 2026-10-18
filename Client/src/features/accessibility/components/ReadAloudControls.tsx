import { Pause, Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReadAloud } from "../hooks/useReadAloud";

type ReadAloudControlsProps = {
  owner: string;
  lines: string[];
  label?: string;
};

export function ReadAloudControls({ owner, lines, label = "Read aloud" }: ReadAloudControlsProps) {
  const { enabled, status, play, pause, resume, stop } = useReadAloud(owner);

  if (!enabled) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "speaking" && (
        <Button type="button" variant="outline" size="lg" onClick={pause}>
          <Pause aria-hidden="true" />
          Pause
        </Button>
      )}
      {status === "paused" && (
        <Button type="button" variant="outline" size="lg" onClick={resume}>
          <Play aria-hidden="true" />
          Resume
        </Button>
      )}
      {status === "idle" && (
        <Button type="button" variant="outline" size="lg" onClick={() => play(lines)}>
          <Volume2 aria-hidden="true" />
          {label}
        </Button>
      )}
      {status !== "idle" && (
        <Button type="button" variant="outline" size="lg" onClick={stop}>
          <Square aria-hidden="true" />
          Stop
        </Button>
      )}
    </div>
  );
}
