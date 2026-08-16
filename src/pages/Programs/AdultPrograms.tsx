import { useTranslation } from "react-i18next";

import { ProgramsList } from "../../components/Programs/AdultProgramms/ProgramsList";

export const AdultPrograms = () => {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="adult-programs-title"
      className="font-nunito w-full"
    >
      <header className="flex flex-col items-start justify-center gap-6 py-8 md:flex-row md:gap-10 md:py-12">
        <div className="flex max-w-full shrink-0 flex-col items-center justify-center">
          <h1
            id="adult-programs-title"
            className="text-preset-2 pb-1 text-center font-semibold tracking-tight text-slate-950"
          >
            {t("programs.adults.title")}
          </h1>

          <div
            aria-hidden="true"
            className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
          />
        </div>

        <p className="text-preset-4 max-w-4xl px-2 text-center font-medium text-slate-600 md:px-0 md:text-left">
          {t("programs.adults.description")}
        </p>
      </header>

      <ProgramsList />
    </section>
  );
};
