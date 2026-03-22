import { useEffect, useState } from "react";
import { LessonsGrid } from "../../components/Lessons/LessonsGrid";
import { ScheduleCalendar } from "../../components/Lessons/ScheduleCalendar";
import type { AgeGroup } from "../../types/ageGroup";
import type { Program } from "../../types/program";
import { programsService } from "../../services/programsService";
import { Loader2 } from "lucide-react";

export const ProgramsKids = () => {
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedGroups, fetchedPrograms] = await Promise.all([
          programsService.getAgeGroups(),
          programsService.getPrograms(),
        ]);

        setAgeGroups(fetchedGroups);
        setPrograms(fetchedPrograms);
      } catch (error) {
        console.error("Помилка при завантаженні початкових даних:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="font-nunito w-full py-8">
      <div className="flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h2 className="text-preset-2 flex flex-nowrap justify-center pb-4 font-bold">
            Програми для дітей
          </h2>
          <div className="mb-4 h-1 w-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <p className="text-preset-4 flex max-w-4xl items-center justify-center px-4 leading-8 font-semibold md:px-0">
          Розкрийте свій потенціал через різноманітні курси та тренінги, створені для натхнення,
          навчання новому та вдосконалення ваших здібностей.
        </p>
      </div>
      {/* 👇 Показуємо лоадер або самі компоненти з переданими пропсами */}
      {isLoading ? (
        <div className="flex min-h-[300px] w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {/* Передаємо дані далі */}
          <ScheduleCalendar programs={programs} ageGroups={ageGroups} />
          <LessonsGrid programs={programs} ageGroups={ageGroups} setPrograms={setPrograms} />
        </div>
      )}
    </div>
  );
};
