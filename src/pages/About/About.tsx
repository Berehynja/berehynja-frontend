import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import { OurStory } from "../../components/About/OurStory/OurStory";
import { MembersList } from "../../components/About/Team/MembersList";
import { Partners } from "../../components/About/Partners/Partners";

export const About = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="font-nunito flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-nunito flex justify-center pb-4 text-4xl uppercase md:text-5xl">
            {t("about.aboutUs")}
          </h1>
          <div className="mx-auto mb-4 h-1 w-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>
        <p className="text-preset-4 flex max-w-5xl items-center justify-center px-4 text-lg leading-8 text-gray-600 italic md:px-0 md:text-left">
          {t("about.missionDescription")}
        </p>
      </div>

      {/* STORY & BANNER SECTION */}
      <section className="my-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <OurStory />
      </section>

      {/* MEMBERS SECTION */}
      <section className="py-16">
        <MembersList />
      </section>

      {/* PARTNERS SECTION */}
      <section className="py-20">
        <Partners />
      </section>

      {/* STATUT */}
      <div className="mt-20 flex justify-center pb-20">
        <a
          href="#"
          className="group flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-4 text-white shadow-xl transition-all hover:bg-blue-600"
        >
          <FileText size={24} />
          <span className="text-sm font-bold tracking-wider uppercase">
            Статут Організації (PDF)
          </span>
        </a>
      </div>
    </div>
  );
};
