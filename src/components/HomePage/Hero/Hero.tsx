import { useEffect, useState } from "react";
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

interface HeroMediaData {
  bannerImage?: string;
  bannerImageMobile?: string;
  mobileBannerImage?: string;
}

const getHeroImageUrl = (url: string, width: number) =>
  optimizeCloudinaryImage(url, `c_limit,w_${width}/f_auto/q_auto:good`);

const getHeroSrcSet = (url: string) =>
  [640, 960, 1280, 1600, 1920]
    .map((width) => `${getHeroImageUrl(url, width)} ${width}w`)
    .join(", ");

const getHeroMobileImageUrl = (url: string, width: number) =>
  optimizeCloudinaryImage(
    url,
    `c_pad,g_center,b_auto,ar_1:2,w_${width}/f_auto/q_auto:good`,
  );

const getHeroMobileSrcSet = (url: string) =>
  [480, 640, 768, 960]
    .map((width) => `${getHeroMobileImageUrl(url, width)} ${width}w`)
    .join(", ");

export const Hero = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const { getText, isLoading, data } = useFirebaseContent("home");

  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false,
  );
  const [isBannerReady, setIsBannerReady] = useState(false);
  const [hasLoadingTimedOut, setHasLoadingTimedOut] = useState(false);

  const title = getText("hero.title", t("home.welcome"));
  const description = getText("hero.description", t("home.description"));

  const heroMedia = (data?.hero ?? {}) as HeroMediaData;

  const currentBanner = heroMedia.bannerImage?.trim() || null;
  const currentMobileBanner =
    heroMedia.bannerImageMobile?.trim() ||
    heroMedia.mobileBannerImage?.trim() ||
    currentBanner;

  const activeBanner = isMobileViewport
    ? currentMobileBanner
    : currentBanner;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleViewportChange = () => setIsMobileViewport(mediaQuery.matches);

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);

    return () =>
      mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    setIsBannerReady(!activeBanner);
    setHasLoadingTimedOut(false);

    if (!activeBanner) return;

    const safetyTimeoutId = window.setTimeout(() => {
      setHasLoadingTimedOut(true);
    }, 8000);

    return () => window.clearTimeout(safetyTimeoutId);
  }, [activeBanner]);

  const isHeroReady =
    !isLoading && (isBannerReady || hasLoadingTimedOut || !activeBanner);

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
      mediaCategory: "mobileBanners",
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
        {activeBanner && (
          <img
            key={`${isMobileViewport ? "mobile" : "desktop"}-${activeBanner}`}
            src={
              isMobileViewport
                ? getHeroMobileImageUrl(activeBanner, 768)
                : getHeroImageUrl(activeBanner, 1280)
            }
            srcSet={
              isMobileViewport
                ? getHeroMobileSrcSet(activeBanner)
                : getHeroSrcSet(activeBanner)
            }
            sizes="100vw"
            alt=""
            aria-hidden="true"
            width={isMobileViewport ? 960 : 1920}
            height={isMobileViewport ? 1920 : 1080}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setIsBannerReady(true)}
            onError={() => setIsBannerReady(true)}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
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
