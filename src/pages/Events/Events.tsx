import { useTranslation } from "react-i18next";

import { EventList } from "../../components";

export const Events = () => {
  const { t } = useTranslation();


  return (
    <div className="font-nunito w-full">
      <header className="flex flex-col items-center justify-center gap-6 py-8 md:flex-row md:gap-10 md:py-12">
        <div className="flex max-w-full shrink-0 flex-col items-center justify-center">
          <h1 className="pb-1 text-center text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            {t("events.page.title")}
          </h1>

          <div
            aria-hidden="true"
            className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
          />
        </div>

        <p className="max-w-4xl px-2 text-center text-base leading-6 font-medium text-slate-600 md:px-0 md:text-left md:text-lg ">
          {t("events.page.description")}
        </p>
      </header>

      <section
        aria-label={t("events.page.title")}
        className="flex w-full flex-col items-center justify-center gap-8 md:gap-12"
      >
        <EventList />
      </section>
    </div>
  );
};
