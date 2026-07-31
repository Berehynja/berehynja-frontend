import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Heart, UserPlus } from "lucide-react";

import { DonationModal } from "../DonationModal/DonationModal";
import { JoinModal } from "../JoinModal";
import ban from "../../../images/children.jpg";
import { useFirebaseContent } from "../../../hooks/useFirebaseContent";
import { EditTextModal, type FieldConfig } from "../../Modals/EditTextModal";
import { useAuth } from "../../AuthProvider/useAuth";
import EditButton from "../../Buttons/EditButton";

export const Hero = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [displayedBanner, setDisplayedBanner] = useState<string | null>(null);
  const { getText, isLoading, data } = useFirebaseContent("home");

  const title = getText("hero.title", t("home.welcome"));
  const description = getText("hero.description", t("home.description"));

  const currentBanner =
    (data?.hero as Record<string, string>)?.bannerImage || ban;

  useEffect(() => {
    if (isLoading) return;
    if (currentBanner === displayedBanner) return;

    let isActive = true;
    const image = new Image();

    image.src = currentBanner;
    image.onload = () => {
      if (isActive) {
        setDisplayedBanner(currentBanner);
      }
    };

    return () => {
      isActive = false;
    };
  }, [currentBanner, displayedBanner, isLoading]);

  const heroFields: FieldConfig[] = [
    {
      key: "bannerImage",
      label: "Фонове зображення",
      type: "image" as unknown as FieldConfig["type"],
      mediaCategory: "banners",
    } as unknown as FieldConfig,
    { key: "title", label: "Головний заголовок", type: "input" },
    { key: "description", label: "Опис під заголовком", type: "textarea" },
  ];

  return (
    <section className="relative flex min-h-[clamp(42rem,85svh,54rem)] w-full justify-center overflow-hidden rounded-b-3xl bg-gray-900">
      {displayedBanner && (
        <img
          src={displayedBanner}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        />
      )}

      <div className="relative z-10 flex min-h-[clamp(42rem,85svh,54rem)] w-full max-w-120 flex-col items-start justify-between p-5 md:max-w-5xl md:p-6 lg:max-w-7xl lg:p-8 xl:max-w-full xl:p-10">
        {isAdmin && (
          <EditButton
            onClick={() => setIsEditOpen(true)}
            className="top-2 right-4 h-12 w-12 border border-gray-200 bg-white text-gray-700 shadow-xl hover:scale-110 hover:bg-blue-600 hover:text-white"
          />
        )}

        <div className="mt-auto mb-auto w-full sm:mt-0">
          <h1 className="text-preset-1 font-nunito mb-6 align-sub tracking-tighter text-white uppercase drop-shadow-2xl md:text-4xl lg:text-5xl">
            {isLoading ? "..." : title}
          </h1>
        </div>

        <div className="mt-auto mb-auto w-full sm:mb-0">
          <p className="text-preset-2 block w-full max-w-7xl rounded-3xl border border-white/10 bg-black/40 p-6 indent-8 text-xl leading-8 text-white backdrop-blur-md md:text-3xl md:leading-10">
            {description}
          </p>
        </div>

        <div className="mt-8 flex w-full flex-col gap-4 md:w-auto md:flex-row md:gap-6">
          <button
            type="button"
            onClick={() => setIsDonationOpen(true)}
            className="group font-nunito flex cursor-pointer items-center justify-center gap-4 rounded-2xl bg-yellow-400 px-10 py-5 text-sm tracking-widest text-gray-900 uppercase shadow-xl transition-all hover:scale-105 hover:bg-yellow-500 md:text-base"
          >
            <Heart size={20} className="fill-current group-hover:animate-pulse" />
            <span>Благодійність</span>
          </button>

          <button
            type="button"
            onClick={() => setIsJoinOpen(true)}
            className="group font-nunito flex cursor-pointer items-center justify-center gap-4 rounded-2xl border border-white/30 bg-white/10 px-10 py-5 text-sm tracking-widest text-white uppercase backdrop-blur-md transition-all hover:bg-white hover:text-blue-900 md:text-base"
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

      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
      <JoinModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
      />

      <EditTextModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        documentName="home"
        sectionName="hero"
        modalTitle="Редагування Головного Екрану"
        initialData={data?.hero as Record<string, unknown>}
        fields={heroFields}
      />
    </section>
  );
};
