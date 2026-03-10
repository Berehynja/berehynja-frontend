import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, UserPlus, ArrowRight } from "lucide-react";
import { DonationModal } from "../Modals/DonationModal/DonationModal";
import { JoinModal } from "../Modals/JoinModal";
import ban from "../../images/children.jpg";
import { useFirebaseContent } from "../../hooks/useFirebaseContent";

export const Hero = () => {
  const { t } = useTranslation();
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const { getText, isLoading } = useFirebaseContent("home");

  // Перший аргумент - шлях у базі, другий - запасний текст з локального JSON
  const title = getText("title", t("home.welcome"));
  const description = getText("description", t("home.description"));

  return (
    <section
      className="flex min-h-[90vh] w-full justify-center overflow-hidden rounded-b-3xl bg-gray-900 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${ban})` }}
    >
      <div className="flex max-w-120 min-w-85 flex-col items-start justify-between p-5 md:max-w-5xl md:p-6 lg:min-h-190 lg:max-w-7xl lg:p-8 xl:max-w-full xl:p-10">
        {/* Контентна частина */}
        <div className="mt-auto mb-auto w-full sm:mt-0">
          <h1 className="text-preset-1 mb-6 align-sub font-bold tracking-tighter text-white uppercase drop-shadow-2xl md:text-4xl lg:text-5xl">
            {isLoading ? "..." : title}
          </h1>
        </div>

        <div className="mt-auto mb-auto w-full sm:mb-0">
          <p className="text-preset-2 block w-full max-w-7xl rounded-3xl border border-white/10 bg-black/40 p-6 indent-8 text-xl leading-8 text-white backdrop-blur-md md:text-3xl md:leading-10">
            {description}
          </p>
        </div>

        {/* Секція кнопок */}
        <div className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:gap-6">
          <button
            onClick={() => setIsDonationOpen(true)}
            className="group font-montserratBold flex cursor-pointer items-center justify-center gap-4 rounded-2xl bg-yellow-400 px-10 py-5 text-sm tracking-widest text-gray-900 uppercase shadow-xl transition-all hover:scale-105 hover:bg-yellow-500 md:text-base"
          >
            <Heart size={20} className="fill-current group-hover:animate-pulse" />
            <span>Благодійність</span>
          </button>

          <button
            onClick={() => setIsJoinOpen(true)}
            className="group font-montserratBold flex cursor-pointer items-center justify-center gap-4 rounded-2xl border border-white/30 bg-white/10 px-10 py-5 text-sm tracking-widest text-white uppercase backdrop-blur-md transition-all hover:bg-white hover:text-blue-900 md:text-base"
          >
            <UserPlus size={20} />
            <span>Приєднатися</span>
            <ArrowRight
              size={20}
              className="-translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
            />
          </button>
        </div>
      </div>

      {/* Підключені Модалки */}
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
      <JoinModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
    </section>
  );
};
