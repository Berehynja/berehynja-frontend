import { LessonsGrid } from "../../components/Lessons/LessonsGrid";
import { ScheduleCalendar } from "../../components/Lessons/ScheduleCalendar";

export const Programs = () => {
  return (
    <div className="w-full font-nunito">
     <LessonsGrid/>
     <ScheduleCalendar/>
    </div>
  );
}