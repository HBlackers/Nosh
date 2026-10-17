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
    // Switches on the container's width, not the screen's: the page shares the screen with the nav and the shopping list.
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
