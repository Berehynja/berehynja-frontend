import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LessonsGrid } from "../../components/Programs/KidsProgramm/LessonsGrid";
import { ScheduleCalendar } from "../../components/Programs/KidsProgramm/ScheduleCalendar";
import { PageLoader } from "../../components/ui/PageLoader";
import type { AgeGroup } from "../../types/ageGroup";
import type { Program } from "../../types/program";
import { programsService } from "../../services/programsService";

export const ProgramsKids = () => {
  const { t } = useTranslation();
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleLoading, setIsScheduleLoading] = useState(true);

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

    void loadData();
  }, []);

  return (
    <div
      aria-busy={isLoading || isScheduleLoading}
      className="font-nunito w-full"
    >
      <PageLoader visible={isLoading || isScheduleLoading} />

      <header className="flex flex-col items-center justify-center gap-6 py-8 md:flex-row md:gap-10 md:py-12">
        <div className="flex max-w-full shrink-0 flex-col items-center justify-center">
          <h1 className="text-preset-2 pb-1 text-center font-semibold tracking-tight text-slate-950">
            {t("programs.kids.title")}
          </h1>

          <div
            aria-hidden="true"
            className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
          />
        </div>

        <p className="text-preset-4 max-w-4xl px-2 text-center leading-6 font-medium text-slate-600 md:px-0 md:text-left">
          {t("programs.kids.description")}
        </p>
      </header>

      <div className="flex flex-col gap-20">
        <ScheduleCalendar
          programs={programs}
          ageGroups={ageGroups}
          onLoadingChange={setIsScheduleLoading}
        />

        {!isLoading && (
          <LessonsGrid
            programs={programs}
            ageGroups={ageGroups}
            setPrograms={setPrograms}
          />
        )}
      </div>
    </div>
  );
};
