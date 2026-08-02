import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Heart, UserPlus } from "lucide-react";

import { DonationModal } from "../DonationModal/DonationModal";
import { JoinModal } from "../JoinModal";
import { useFirebaseContent } from "../../../hooks/useFirebaseContent";
import { optimizeCloudinaryImage } from "../../../services/cloudinaryService";
import { EditTextModal, type FieldConfig } from "../../Modals/EditTextModal";
import { useAuth } from "../../AuthProvider/useAuth";
import EditButton from "../../Buttons/EditButton";
import { PageLoader } from "../../ui/PageLoader";
import type { LangKey } from "../../../types/types";

const HERO_BANNER_CACHE_KEY = "berehynia-hero-banner";

const HERO_INTERFACE_TEXT = {
  donate: {
    ua: "Благодійність",
    de: "Spenden",
    en: "Donate",
  },
  join: {
    ua: "Приєднатися",
    de: "Mitmachen",
    en: "Join us",
  },
  bannerField: {
    ua: "Фонове зображення",
    de: "Hintergrundbild",
    en: "Background image",
  },
  titleField: {
    ua: "Головний заголовок",
    de: "Hauptüberschrift",
    en: "Main heading",
  },
  descriptionField: {
    ua: "Опис під заголовком",
    de: "Beschreibung unter der Überschrift",
    en: "Description below the heading",
  },
  editModalTitle: {
    ua: "Редагування головного екрана",
    de: "Startbildschirm bearbeiten",
    en: "Edit hero section",
  },
};

const getInitialBanner = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(HERO_BANNER_CACHE_KEY);
  } catch {
    return null;
  }
};

const getHeroImageUrl = (url: string, width: number) =>
  optimizeCloudinaryImage(url, `f_auto,q_auto:good,c_limit,w_${width}`);

const getHeroSrcSet = (url: string) =>
  [640, 960, 1280, 1600, 1920]
    .map((width) => `${getHeroImageUrl(url, width)} ${width}w`)
    .join(", ");

export const Hero = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const { getText, isLoading, data } = useFirebaseContent("home");

  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [displayedBanner, setDisplayedBanner] = useState(getInitialBanner);
  const [nextBanner, setNextBanner] = useState<string | null>(null);
  const [isNextBannerVisible, setIsNextBannerVisible] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const [hasLoadingTimedOut, setHasLoadingTimedOut] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language).split(
    "-",
  )[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  const title = getText("hero.title", t("home.welcome"));
  const description = getText("hero.description", t("home.description"));

  const currentBanner =
    (data?.hero as Record<string, string>)?.bannerImage?.trim() || null;

  useEffect(() => {
    if (isLoading) return;

    if (!currentBanner) {
      setIsPageReady(true);
      return;
    }

    if (currentBanner === displayedBanner) return;

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    // Додаємо URL до DOM одразу, без додаткової затримки через new Image().
    setIsNextBannerVisible(false);
    setNextBanner(currentBanner);
  }, [currentBanner, displayedBanner, isLoading]);

  useEffect(() => {
    const safetyTimeoutId = window.setTimeout(() => {
      setHasLoadingTimedOut(true);
    }, 8000);

    return () => window.clearTimeout(safetyTimeoutId);
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const cacheBanner = (bannerUrl: string) => {
    try {
      window.localStorage.setItem(HERO_BANNER_CACHE_KEY, bannerUrl);
    } catch {
      // Кешування є лише додатковою оптимізацією.
    }
  };

  const handleDisplayedBannerReady = () => {
    setIsPageReady(true);
  };

  const handleNextBannerLoad = () => {
    if (!nextBanner) return;

    // На першому завантаженні прибираємо лоадер тільки після готовності банера.
    if (!displayedBanner) {
      setDisplayedBanner(nextBanner);
      cacheBanner(nextBanner);
      setNextBanner(null);
      setIsPageReady(true);
      return;
    }

    setIsPageReady(true);
    window.requestAnimationFrame(() => setIsNextBannerVisible(true));

    transitionTimeoutRef.current = window.setTimeout(() => {
      setDisplayedBanner(nextBanner);
      cacheBanner(nextBanner);
      setNextBanner(null);
      setIsNextBannerVisible(false);
      transitionTimeoutRef.current = null;
    }, 500);
  };

  const handleNextBannerError = () => {
    setNextBanner(null);
    setIsNextBannerVisible(false);
    setIsPageReady(true);
  };

  const isHeroReady = (isPageReady && !isLoading) || hasLoadingTimedOut;

  const heroFields: FieldConfig[] = [
    {
      key: "bannerImage",
      label: HERO_INTERFACE_TEXT.bannerField[currentLang],
      type: "image" as unknown as FieldConfig["type"],
      mediaCategory: "banners",
    } as unknown as FieldConfig,
    {
      key: "title",
      label: HERO_INTERFACE_TEXT.titleField[currentLang],
      type: "input",
    },
    {
      key: "description",
      label: HERO_INTERFACE_TEXT.descriptionField[currentLang],
      type: "textarea",
    },
  ];

  return (
    <>
      <PageLoader visible={!isHeroReady} />

      <section className="relative flex min-h-[clamp(42rem,85svh,54rem)] w-full justify-center overflow-hidden rounded-b-3xl bg-linear-to-br from-slate-800 via-slate-900 to-blue-950">
        {displayedBanner && (
          <img
            src={getHeroImageUrl(displayedBanner, 1280)}
            srcSet={getHeroSrcSet(displayedBanner)}
            sizes="100vw"
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={handleDisplayedBannerReady}
            onError={handleDisplayedBannerReady}
            className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
          />
        )}

        {nextBanner && (
          <img
            src={getHeroImageUrl(nextBanner, 1280)}
            srcSet={getHeroSrcSet(nextBanner)}
            sizes="100vw"
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority={displayedBanner ? "auto" : "high"}
            decoding="async"
            onLoad={handleNextBannerLoad}
            onError={handleNextBannerError}
            className={`absolute inset-0 h-full w-full object-cover object-[center_35%] transition-opacity duration-500 ${
              isNextBannerVisible || !displayedBanner
                ? "opacity-100"
                : "opacity-0"
            }`}
          />
        )}

        <div className="relative z-10 flex min-h-[clamp(42rem,85svh,54rem)] w-full max-w-120 flex-col items-start justify-between p-5 md:max-w-5xl md:p-6 lg:max-w-7xl lg:p-8 xl:max-w-full xl:p-10">
          {isAdmin && (
            <EditButton
              onClick={() => setIsEditOpen(true)}
              className="top-2 right-4 h-12 w-12 border border-gray-200 bg-white text-gray-700 shadow-xl hover:scale-110 hover:bg-blue-600 hover:text-white"
            />
          )}

          <div className="mt-auto mb-auto w-full md:mt-0">
            <h1 className="text-preset-1 font-nunito mb-6 align-sub tracking-tighter text-white uppercase drop-shadow-2xl md:text-4xl lg:text-5xl">
              {isLoading ? "..." : title}
            </h1>
          </div>

          <div className="mt-auto mb-auto w-full md:mb-0">
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
              <Heart
                size={20}
                className="fill-current group-hover:animate-pulse"
              />
              <span>{HERO_INTERFACE_TEXT.donate[currentLang]}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsJoinOpen(true)}
              className="group font-nunito flex cursor-pointer items-center justify-center gap-4 rounded-2xl border border-white/30 bg-white/10 px-10 py-5 text-sm tracking-widest text-white uppercase backdrop-blur-md transition-all hover:bg-white hover:text-blue-900 md:text-base"
            >
              <UserPlus size={20} />
              <span>{HERO_INTERFACE_TEXT.join[currentLang]}</span>
              <ArrowRight
                size={20}
                className="-translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
              />
            </button>
          </div>
        </div>
      </section>

      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />

      <JoinModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />

      <EditTextModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        documentName="home"
        sectionName="hero"
        modalTitle={HERO_INTERFACE_TEXT.editModalTitle[currentLang]}
        initialData={data?.hero as Record<string, unknown>}
        fields={heroFields}
      />
    </>
  );
};
