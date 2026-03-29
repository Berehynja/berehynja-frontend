import { useTranslation } from "react-i18next";
import { FileText, Handshake } from "lucide-react";
import { MembersList } from "../../components/About/Team/MembersList";



import partner from "../../images/icons8-penguin-color/icons8-penguin-48.png";
import { OurStory } from "../../components/About/OurStory/OurStory";



export const About = () => {
  const { t } = useTranslation();
  

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-montserratBold flex justify-center pb-4 text-4xl md:text-5xl uppercase">
            {t("about.aboutUs")}
          </h1>
          <div className="mx-auto mb-4 h-1.5 w-24 rounded-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>
        <p className="text-preset-4 flex max-w-5xl items-center justify-center px-4 leading-8 text-gray-600 italic md:px-0 md:text-left text-lg">
          {t("about.missionDescription")}
        </p>
      </div>

      {/* STORY & BANNER SECTION */}
      <section className="my-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        < OurStory />
      </section>

      {/* MEMBERS SECTION */}
      <section className="py-16">
        <MembersList />
      </section>

      {/* PARTNERS SECTION */}
      <section className="py-20">
        <div className="mb-12 text-center">
          <h2 className="font-montserratBold mb-4 flex items-center justify-center gap-3 text-3xl uppercase">
            <Handshake className="text-yellow-500" size={32} /> {t("about.ourPartners")}
          </h2>
          <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-linear-to-r from-yellow-400 to-blue-500"></div>
        </div>
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {[
            { name: "Генеральне консульство України", id: 1 },
            { name: "МЗС України", id: 2 },
            { name: "Integrationamt Bad Oeynhausen", id: 3 },
            { name: "Plast – Німеччина", id: 4 },
            { name: "Українська школа в Гамбурзі", id: 5 },
            { name: "Фонд «Відродження»", id: 6 },
          ].map((partnerItem) => (
            <li key={partnerItem.id} className="group relative flex flex-col items-center">
              {/* КОНТЕЙНЕР ЛОГОТИПА */}
              <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-[2.5rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-blue-100 group-hover:shadow-xl">
                <img
                  src={partner}
                  alt={partnerItem.name}
                  className="h-16 w-16 object-contain opacity-60 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-100"
                />
              </div>

              {/* НАЗВА ПАРТНЕРА */}
              <p className="px-2 text-center text-[14px] font-bold tracking-wider text-slate-400 uppercase transition-colors group-hover:text-blue-600 leading-tight">
                {partnerItem.name}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* STATUT */}
      <div className="mt-20 flex justify-center pb-20">
        <a href="#" className="group flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-4 text-white shadow-xl hover:bg-blue-600 transition-all">
          <FileText size={24} />
          <span className="font-bold uppercase text-sm tracking-wider">Статут Організації (PDF)</span>
        </a>
      </div>
    </div>
  );
};
