import { LessonsGrid } from "../../components/Lessons/LessonsGrid";
import { ScheduleCalendar } from "../../components/Lessons/ScheduleCalendar";

export const Programs = () => {
  return (
    <div className="w-full ">
      <h2 className="text-preset-2 my-4 text-center">Програми</h2>
     <LessonsGrid/>

     <h2 className="text-preset-2 my-4 text-center">Графік занять</h2>
     <ScheduleCalendar/>
    </div>
  );
}