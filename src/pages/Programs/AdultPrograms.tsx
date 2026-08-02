import { useTranslation } from "react-i18next";

import { ProgramsList } from "../../components/Programs/AdultProgramms/ProgramsList";

export const AdultPrograms = () => {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="adult-programs-title"
      className="font-nunito w-full py-8"
    >
      <div className="flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex max-w-full flex-col items-center justify-center">
          <h2
            id="adult-programs-title"
            className="text-preset-2 pb-4 text-center font-bold text-balance"
          >
            {t("programs.adults.title")}
          </h2>

          <div
            aria-hidden="true"
            className="mb-4 h-1 w-full bg-linear-to-r from-blue-500 to-yellow-400"
          />
        </div>

        <p className="text-preset-4 max-w-4xl px-4 text-center leading-8 font-semibold md:px-0 md:text-left">
          {t("programs.adults.description")}
        </p>
      </div>

      <ProgramsList />
    </section>
  );
};
