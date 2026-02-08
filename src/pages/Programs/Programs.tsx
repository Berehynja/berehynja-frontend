import { LessonsGrid } from "../../components/Lessons/LessonsGrid";
import { ScheduleCalendar } from "../../components/Lessons/ScheduleCalendar";

export const Programs = () => {
  return (
    <div className="font-nunito w-full py-8">
      <div className="flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h2 className="text-preset-2 flex flex-nowrap justify-center pb-4 font-bold">
            Програми для дітей
          </h2>
          <div className="mb-4 h-1 w-24 bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <p className="text-preset-4 flex max-w-4xl items-center justify-center px-4 leading-8 font-semibold md:px-0">
          Розкрийте свій потенціал через різноманітні курси та тренінги, створені для натхнення,
          навчання новому та вдосконалення ваших здібностей.
        </p>
      </div>
      <LessonsGrid />
      <ScheduleCalendar />
    </div>
  );
};
