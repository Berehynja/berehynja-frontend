import { useTranslation } from "react-i18next";

import { EventList } from "../../components";
import type { LangKey } from "../../types/types";

const EVENTS_PAGE_TEXT = {
  title: {
    ua: "Події",
    de: "Veranstaltungen",
    en: "Events",
  },
  description: {
    ua: "Приєднуйтеся до наших громадських заходів, святкувань та інших активностей, створених для об’єднання людей і підтримки нашої місії.",
    de: "Nehmen Sie an unseren Gemeinschaftsveranstaltungen, Feiern und weiteren Aktivitäten teil, die Menschen zusammenbringen und unsere Mission unterstützen.",
    en: "Join our community events, celebrations and other activities designed to bring people together and support our mission.",
  },
};

export const Events = () => {
  const { i18n } = useTranslation();

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language)
    .split("-")[0]
    .toLowerCase();
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  return (
    <div className="font-nunito w-full">
      <header className="flex flex-col items-center justify-center gap-6 py-8 md:flex-row md:gap-10 md:py-12">
        <div className="flex max-w-full shrink-0 flex-col items-center justify-center">
          <h1 className="pb-4 text-center text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            {EVENTS_PAGE_TEXT.title[currentLang]}
          </h1>

          <div
            aria-hidden="true"
            className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
          />
        </div>

        <p className="max-w-4xl px-2 text-center text-base leading-7 font-medium text-slate-600 md:px-0 md:text-left md:text-lg md:leading-8">
          {EVENTS_PAGE_TEXT.description[currentLang]}
        </p>
      </header>

      <section
        aria-label={EVENTS_PAGE_TEXT.title[currentLang]}
        className="flex w-full flex-col items-center justify-center gap-8 md:gap-12"
      >
        <EventList />
      </section>
    </div>
  );
};
