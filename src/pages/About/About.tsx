import { useTranslation } from "react-i18next";
import { FileText, Users2, Handshake } from "lucide-react";
import about from "../../images/bereg-about22.jpg";
// import avatar from "../../images/icons8-avatar-3d-fluency/icons8-avatar-100.png";
import partner from "../../images/icons8-penguin-color/icons8-penguin-48.png";
import { useState } from "react";
import { MemberModal } from "../../components/Modals/MemberModal";
import type { TeamMember } from "../../types/teamMember";
import { teamData } from "../../data/teamData";

export const About = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { t } = useTranslation();
  const PhotoPlaceholder = () => (
  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 text-gray-400">
    <Users2 size={80} strokeWidth={1} className="opacity-40" />
  </div>
);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12">
      {/* HEADER SECTION - Твій оригінальний стиль */}
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-montserratBold flex justify-center pb-4 text-4xl md:text-5xl">
            {t("about.aboutUs")}
          </h1>
          <div className="mx-auto mb-4 h-1.5 w-24 rounded-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <p className="text-preset-4 flex max-w-3xl items-center justify-center px-4 leading-8 text-gray-600 italic md:px-0 md:text-left">
          {t("about.missionDescription")}
        </p>
      </div>

      {/* STORY SECTION - Сучасний Layout */}
      <section className="my-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <h2 className="font-montserratBold mb-6 border-l-4 border-blue-500 pl-4 text-3xl text-gray-900">
            {t("about.storyTitle")}
          </h2>
          <p className="font-montserratRegular text-lg leading-relaxed text-gray-700">
            {t("about.storyContent")}
          </p>
        </div>
        <div className="group relative order-1 h-[400px] overflow-hidden rounded-[2.5rem] shadow-2xl lg:order-2">
          <img
            src={about}
            alt="About Berehynja"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        </div>
      </section>

      {/* TEAM SECTION - Великі сучасні картки */}
      <section className="py-16">
        <div className="mb-12 text-center">
          <h2 className="font-montserratBold text-3xl mb-4 flex items-center justify-center gap-3">
            <Users2 className="text-blue-500" size={32} /> Наша команда
          </h2>
          <div className="mx-auto h-1 w-20 bg-blue-500 rounded-full mb-6"></div>

        </div>

        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamData.map((member, index) => (
            <li 
              key={index} 
              onClick={() => setSelectedMember(member)} 
              className="group relative flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* ДЕКОРАТИВНЫЙ КОНТЕЙНЕР ФОТО */}
              <div className="relative mb-6 h-80 w-full overflow-hidden rounded-[2.5rem] bg-white shadow-xl border-4 border-white transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-50">
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <PhotoPlaceholder />
                )}
                
                {/* Легкий градиент-наложение при наведении */}
                <div className="absolute inset-0 bg-linear-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* ТЕКСТОВЫЙ БЛОК С ДЕКОРОМ */}
              <div className="px-4">
                <h3 className="font-montserratBold text-xl text-gray-900 mb-1">
                  {member.name}
                </h3>
                
                {/* Та самая динамическая желтая линия */}
                <div className="mx-auto mb-3 h-1 w-10 bg-yellow-400 transition-all duration-300 group-hover:w-20 rounded-full"></div>
                
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-600 opacity-80 group-hover:opacity-100 transition-opacity">
                  {member.role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Модалка */}
      <MemberModal 
        member={selectedMember} 
        onClose={() => setSelectedMember(null)} 
      />

      {/* PARTNERS SECTION - У стилі карток команди */}
      <section className="py-20">
        <div className="mb-12 text-center">
          <h2 className="font-montserratBold mb-4 flex items-center justify-center gap-3 text-3xl">
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
              {/* КОНТЕЙНЕР ЛОГОТИПА (Квадратний з м'якими кутами) */}
              <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-4xl border border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-blue-100 group-hover:shadow-xl">
                <img
                  src={partner}
                  alt="partner placeholder"
                  className="h-16 w-16 object-contain opacity-60 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-100"
                />
              </div>

              {/* НАЗВА ПАРТНЕРА */}
              <p className="px-2 text-center text-xs font-bold tracking-wider text-gray-500 uppercase transition-colors group-hover:text-blue-600">
                {partnerItem.name}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* STATUT SECTION */}
      <div className="mt-20 flex justify-center">
        <a
          href="#"
          className="group flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-4 text-white shadow-xl transition-all hover:bg-blue-600"
        >
          <FileText className="transition-transform group-hover:rotate-12" />
          <span className="font-bold tracking-wide">Статут Організації (PDF)</span>
        </a>
      </div>
    </div>
  );
};
