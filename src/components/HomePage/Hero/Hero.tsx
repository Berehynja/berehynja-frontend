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

const HERO_BANNER_CACHE_KEY = "berehynia-hero-banner";
const HERO_MOBILE_BANNER_CACHE_KEY = "berehynia-hero-mobile-banner";

const getInitialBanner = (cacheKey: string): string | null => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(cacheKey);
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
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const { getText, isLoading, data } = useFirebaseContent("home");

  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [displayedBanner, setDisplayedBanner] = useState(() =>
    getInitialBanner(HERO_BANNER_CACHE_KEY),
  );
  const [displayedMobileBanner, setDisplayedMobileBanner] = useState(() =>
    getInitialBanner(HERO_MOBILE_BANNER_CACHE_KEY),
  );
  const [nextBanner, setNextBanner] = useState<string | null>(null);
  const [nextMobileBanner, setNextMobileBanner] = useState<string | null>(null);
  const [isNextBannerVisible, setIsNextBannerVisible] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const [hasLoadingTimedOut, setHasLoadingTimedOut] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  const title = getText("hero.title", t("home.welcome"));
  const description = getText("hero.description", t("home.description"));

  const currentBanner =
    (data?.hero as Record<string, string>)?.bannerImage?.trim() || null;
  const currentMobileBanner =
    (data?.hero as Record<string, string>)?.bannerImageMobile?.trim() ||
    currentBanner;

  useEffect(() => {
    if (isLoading) return;

    if (!currentBanner) {
      setIsPageReady(true);
      return;
    }

    if (
      currentBanner === displayedBanner &&
      currentMobileBanner === displayedMobileBanner
    ) {
      return;
    }

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    setIsNextBannerVisible(false);
    setNextBanner(currentBanner);
    setNextMobileBanner(currentMobileBanner);
  }, [
    currentBanner,
    currentMobileBanner,
    displayedBanner,
    displayedMobileBanner,
    isLoading,
  ]);

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

  const cacheBanner = (cacheKey: string, bannerUrl: string | null) => {
    try {
      if (bannerUrl) {
        window.localStorage.setItem(cacheKey, bannerUrl);
      } else {
        window.localStorage.removeItem(cacheKey);
      }
    } catch {
      // Кешування є лише додатковою оптимізацією.
    }
  };

  const handleDisplayedBannerReady = () => {
    setIsPageReady(true);
  };

  const handleNextBannerLoad = () => {
    if (!nextBanner) return;

    if (!displayedBanner) {
      setDisplayedBanner(nextBanner);
      setDisplayedMobileBanner(nextMobileBanner || nextBanner);
      cacheBanner(HERO_BANNER_CACHE_KEY, nextBanner);
      cacheBanner(
        HERO_MOBILE_BANNER_CACHE_KEY,
        nextMobileBanner || nextBanner,
      );
      setNextBanner(null);
      setNextMobileBanner(null);
      setIsPageReady(true);
      return;
    }

    setIsPageReady(true);
    window.requestAnimationFrame(() => setIsNextBannerVisible(true));

    transitionTimeoutRef.current = window.setTimeout(() => {
      setDisplayedBanner(nextBanner);
      setDisplayedMobileBanner(nextMobileBanner || nextBanner);
      cacheBanner(HERO_BANNER_CACHE_KEY, nextBanner);
      cacheBanner(
        HERO_MOBILE_BANNER_CACHE_KEY,
        nextMobileBanner || nextBanner,
      );
      setNextBanner(null);
      setNextMobileBanner(null);
      setIsNextBannerVisible(false);
      transitionTimeoutRef.current = null;
    }, 500);
  };

  const handleNextBannerError = () => {
    setNextBanner(null);
    setNextMobileBanner(null);
    setIsNextBannerVisible(false);
    setIsPageReady(true);
  };

  const isHeroReady = (isPageReady && !isLoading) || hasLoadingTimedOut;

  const heroFields: FieldConfig[] = [
    {
      key: "bannerImage",
      label: t("home.heroUi.bannerField"),
      type: "image",
      mediaCategory: "banners",
    },
    {
      key: "bannerImageMobile",
      label: t("home.heroUi.mobileBannerField", {
        defaultValue: "Mobile banner",
      }),
      type: "image",
      mediaCategory: "banners",
    },
    {
      key: "title",
      label: t("home.heroUi.titleField"),
      type: "input",
    },
    {
      key: "description",
      label: t("home.heroUi.descriptionField"),
      type: "textarea",
    },
  ];

  return (
    <>
      <PageLoader visible={!isHeroReady} />

      <section className="relative isolate w-full overflow-hidden rounded-b-3xl bg-slate-950 text-white md:min-h-170">
        {displayedBanner && (
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={getHeroSrcSet(
                displayedMobileBanner || displayedBanner,
              )}
              sizes="100vw"
            />
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
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>
        )}

        {nextBanner && (
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={getHeroSrcSet(nextMobileBanner || nextBanner)}
              sizes="100vw"
            />
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
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
                isNextBannerVisible || !displayedBanner
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />
          </picture>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-slate-950/75 via-slate-950/10 to-slate-950/95 md:bg-linear-to-r md:from-slate-950/95 md:via-slate-950/68 md:to-slate-950/5"
        />

        <div className="relative z-10 mx-auto flex min-h-170 w-full max-w-360 flex-col px-5 pt-7 pb-8 md:justify-center md:px-10 md:py-16 lg:px-14 xl:px-18">
          {isAdmin && (
            <EditButton
              onClick={() => setIsEditOpen(true)}
              className="top-3 right-3 h-11 w-11 border border-white/50 bg-white/90 text-slate-700 shadow-lg hover:scale-105 hover:bg-blue-600 hover:text-white md:top-5 md:right-5 md:h-12 md:w-12"
            />
          )}

          <div className="max-w-2xl md:w-[48%] md:min-w-130">
            <div className="w-fit max-w-full">
              <h1 className="font-nunito text-[clamp(2rem,5.4vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance text-white drop-shadow-lg">
                {isLoading ? "..." : title}
              </h1>

              <div
                aria-hidden="true"
                className="mt-4 h-1 w-full rounded-full bg-linear-to-r from-blue-500 to-yellow-400 md:mt-5"
              />
            </div>

            <div aria-hidden="true" className="min-h-48 md:hidden" />

            <p className="mt-5 max-w-xl rounded-2xl border border-white/12 bg-slate-950/35 p-4 text-base leading-7 font-medium text-white/90 shadow-xl backdrop-blur-sm md:mt-7 md:p-5 md:text-lg md:leading-8">
              {description}
            </p>

            <div className="mt-7 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2 md:mt-9 md:gap-4">
              <button
                type="button"
                onClick={() => setIsDonationOpen(true)}
                className="group font-nunito flex min-h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-yellow-400 px-7 py-3.5 text-sm font-bold tracking-wider text-slate-950 uppercase shadow-lg transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-xl active:translate-y-0"
              >
                <Heart
                  size={19}
                  className="fill-current group-hover:animate-pulse"
                />
                <span>{t("home.heroUi.donate")}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsJoinOpen(true)}
                className="group font-nunito flex min-h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-bold tracking-wider text-white uppercase backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:text-blue-950 active:translate-y-0"
              >
                <UserPlus size={19} />
                <span>{t("home.heroUi.join")}</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
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
        modalTitle={t("home.heroUi.editModalTitle")}
        initialData={data?.hero as Record<string, unknown>}
        fields={heroFields}
      />
    </>
  );
};
