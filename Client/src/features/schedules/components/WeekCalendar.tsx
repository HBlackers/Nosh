import { type Occurrence } from "../calendar";
import { WeekGrid } from "./WeekGrid";
import { WeekList } from "./WeekList";

type WeekCalendarProps = {
  weekStart: Date;
  occurrences: Occurrence[];
  today: Date;
};

export function WeekCalendar(props: WeekCalendarProps) {
  return (
    // Switches on the container's width, not the screen's: the left nav takes part of the screen from the lg breakpoint up.
    <div className="@container">
      <div className="hidden @2xl:block">
        <WeekGrid {...props} />
      </div>
      <div className="@2xl:hidden">
        <WeekList {...props} />
      </div>
    </div>
  );
}
