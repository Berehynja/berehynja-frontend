import { LessonsGrid } from "../../components/Lessons/LessonsGrid";
import { ScheduleCalendar } from "../../components/Lessons/ScheduleCalendar";

export const Programs = () => {
  return (
    <div className="font-nunito w-full">
      <LessonsGrid />
      <ScheduleCalendar />
    </div>
  );
};
