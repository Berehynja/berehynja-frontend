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
      className="font-nunito w-full py-8"
    >
      <PageLoader visible={isLoading || isScheduleLoading} />

      <div className="flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h2 className="text-preset-2 flex flex-nowrap justify-center pb-4 font-bold">
            {t("programs.kids.title")}
          </h2>
          <div className="mb-4 h-1 w-full bg-linear-to-r from-blue-500 to-yellow-400" />
        </div>

        <p className="text-preset-4 flex max-w-4xl items-center justify-center px-4 leading-8 font-semibold md:px-0">
          {t("programs.kids.description")}
        </p>
      </div>

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
