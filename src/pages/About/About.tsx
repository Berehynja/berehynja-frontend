import { useTranslation } from "react-i18next";

import { OurStory } from "../../components/About/OurStory/OurStory";
import { MembersList } from "../../components/About/Team/MembersList";
import { Partners } from "../../components/About/Partners/Partners";
import { StatuteManager } from "../../components/About/StatutManager/StatutManager";

export const About = () => {
  const { t } = useTranslation();

  return (
    <div className="font-nunito w-full">
      <header className="flex flex-col items-center justify-center gap-6 py-8 md:flex-row md:gap-10 md:py-12">
        <div className="flex shrink-0 flex-col items-center justify-center">
          <h1 className="text-preset-2 pb-1 text-center font-semibold tracking-tight text-slate-950">
            {t("about.aboutUs")}
          </h1>
          <div
            aria-hidden="true"
            className="h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
          />
        </div>

        <p className="text-preset-4 max-w-4xl px-2 text-center leading-6 font-medium text-slate-600 md:px-0 md:text-left ">
          {t("about.missionDescription")}
        </p>
      </header>

      <StatuteManager />

      <section className="my-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <OurStory />
      </section>

      <section className="py-16">
        <MembersList />
      </section>

      <section className="py-20">
        <Partners />
      </section>
    </div>
  );
};
