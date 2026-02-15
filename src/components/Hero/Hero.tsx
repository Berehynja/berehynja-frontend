import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, UserPlus, ArrowRight } from "lucide-react";
import { DonationModal } from "../Modals/DonationModal/DonationModal"; 
import { JoinModal } from "../Modals/JoinModal";
import ban from "../../images/children.jpg"; 

export const Hero = () => {
  const { t } = useTranslation();
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <section className="flex w-full justify-center bg-gray-900 overflow-hidden">
      <div
        className="flex min-h-75 max-w-120 min-w-85 flex-col items-start justify-between bg-cover bg-center bg-no-repeat p-5  md:min-h-150 md:max-w-5xl md:px-4 lg:min-h-190 lg:max-w-7xl lg:px-8 xl:w-390 xl:px-10"
        style={{ backgroundImage: `url(${ban})` }}
      >
        {/* Контентна частина */}
        <div className="w-full mt-auto mb-auto sm:mt-0 ">
          <h1 className="font-montserratBold mb-6 align-sub text-3xl text-white  md:text-4xl lg:text-5xl uppercase tracking-tighter drop-shadow-2xl">
            {t("home.welcome")}
          </h1>
        </div>

        <div className="w-full mt-auto mb-auto sm:mb-0">
          <p className="font-montserratRegular block w-full max-w-7xl rounded-3xl bg-black/40 p-6 indent-8 text-xl leading-8 text-white backdrop-blur-md border border-white/10 md:text-3xl md:leading-10">
            {t("home.description")}
          </p>
         </div>

        {/* Секція кнопок */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6 w-full sm:w-auto">
          <button
            onClick={() => setIsDonationOpen(true)}
            className="group flex items-center justify-center gap-4 rounded-8 bg-yellow-400 px-10 py-5 font-montserratBold text-sm uppercase tracking-widest text-gray-900 transition-all hover:scale-105 hover:bg-yellow-500 shadow-xl cursor-pointer md:text-base"
          >
            <Heart size={20} className="fill-current group-hover:animate-pulse" />
            <span>Spenden</span>
          </button>

          <button
            onClick={() => setIsJoinOpen(true)}
            className="group flex items-center justify-center gap-4 rounded-8 bg-white/10 px-10 py-5 font-montserratBold text-sm uppercase tracking-widest text-white backdrop-blur-md border border-white/30 transition-all hover:bg-white hover:text-blue-900 cursor-pointer md:text-base"
          >
            <UserPlus size={20} />
            <span>Beitreten</span>
            <ArrowRight size={20} className="opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </button>
        </div>
      </div>

      {/* Підключені Модалки */}
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
      <JoinModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
    </section>
  );
};