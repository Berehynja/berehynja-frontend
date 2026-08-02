import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlignLeft, Sparkles, X } from "lucide-react";

import { COLOR_STYLES } from "../../../constants/colorStyles";
import { AVAILABLE_ICONS } from "../../../data/icons";
import { optimizeCloudinaryImage } from "../../../services/cloudinaryService";
import type { Program } from "../../../types/program";
import type { LangKey } from "../../../types/types";
import { useAuth } from "../../AuthProvider/useAuth";
import EditButton from "../../Buttons/EditButton";
import { PageLoader } from "../../ui/PageLoader";

interface LessonCardProps {
  lesson: Program;
  onEdit?: (program: Program) => void;
}

const getLessonImageUrl = (
  url: string,
  width: number,
  height: number,
) =>
  optimizeCloudinaryImage(
    url,
    `f_auto,q_auto:good,c_fill,g_auto,w_${width},h_${height}`,
  );

export function LessonCard({ lesson, onEdit }: LessonCardProps) {
  const { i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalImageLoading, setIsModalImageLoading] = useState(false);
  const cardButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const currentLang = (
    i18n.resolvedLanguage || i18n.language
  ).split("-")[0] as LangKey;

  const style = COLOR_STYLES[lesson.color] || COLOR_STYLES.RoyalBlue;
  const IconComponent = AVAILABLE_ICONS[lesson.iconName] || Sparkles;
  const title = lesson.title[currentLang] || lesson.title.ua;
  const description =
    lesson.description?.[currentLang] || lesson.description?.ua;
  const modalId = `lesson-modal-${lesson.id}`;
  const modalTitleId = `lesson-modal-title-${lesson.id}`;

  const texts = {
    details: { ua: "Детальніше", de: "Details", en: "Details" },
    close: {
      ua: "Закрити інформацію про програму",
      de: "Programminformation schließen",
      en: "Close program information",
    },
    understood: { ua: "Зрозуміло", de: "Verstanden", en: "Got it" },
    fallbackDescription: {
      ua: "Опис для цієї програми скоро з’явиться. Слідкуйте за оновленнями!",
      de: "Eine Beschreibung dieses Programms folgt in Kürze. Bleiben Sie dran!",
      en: "A description for this program is coming soon. Stay tuned!",
    },
  };

  const openModal = () => {
    setIsModalImageLoading(Boolean(lesson.image));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalImageLoading(false);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const loadingTimeoutId = window.setTimeout(() => {
      setIsModalImageLoading(false);
    }, 8000);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalImageLoading(false);
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(loadingTimeoutId);
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      cardButtonRef.current?.focus();
    };
  }, [isModalOpen]);

  return (
    <>
      <PageLoader visible={isModalOpen && isModalImageLoading} />

      <article
        className={`group relative aspect-square w-full overflow-hidden rounded-[2.5rem] shadow-lg transition-all duration-300 select-none ${style.shadow} hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl`}
      >
        <button
          ref={cardButtonRef}
          type="button"
          onClick={openModal}
          aria-haspopup="dialog"
          aria-expanded={isModalOpen}
          aria-controls={modalId}
          className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden text-left focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-blue-700"
        >
          {lesson.image ? (
            <img
              src={getLessonImageUrl(lesson.image, 640, 640)}
              alt=""
              aria-hidden="true"
              width={640}
              height={640}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div
              className={`absolute inset-0 h-full w-full bg-linear-to-br ${style.gradient}`}
            />
          )}

          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25" />

          <div className="relative z-10 flex h-full w-full flex-col items-center justify-between py-8">
            <div className="flex flex-1 items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-black/30 shadow-xl backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-black/40">
                <IconComponent
                  aria-hidden="true"
                  className="h-8 w-8 text-white"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            <div className="w-[85%]">
              <div className="w-full rounded-2xl border border-white/20 bg-black/60 px-4 py-3 shadow-2xl backdrop-blur-lg transition-all group-hover:bg-black/70">
                <h3 className="text-center text-sm font-black tracking-wider text-white uppercase drop-shadow-md md:text-base">
                  {title}
                </h3>
              </div>
            </div>
          </div>
        </button>

        {isAdmin && (
          <EditButton
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.(lesson);
            }}
            className="top-2 right-4 h-12 w-12 border border-gray-200 bg-white text-gray-700 shadow-xl hover:scale-110 hover:bg-blue-700 hover:text-white"
            size={40}
          />
        )}
      </article>

      {isModalOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md duration-300"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            id={modalId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            className="animate-in zoom-in relative max-h-[calc(100svh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] bg-white shadow-2xl duration-300"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              aria-label={texts.close[currentLang]}
              title={texts.close[currentLang]}
              className="absolute top-6 right-6 z-20 cursor-pointer rounded-full bg-black/60 p-2 text-white backdrop-blur-xl transition-all hover:rotate-90 hover:bg-black/80 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
            >
              <X size={24} aria-hidden="true" />
            </button>

            <div className="flex flex-col">
              <div className="relative h-72 w-full sm:h-96">
                {lesson.image ? (
                  <img
                    src={getLessonImageUrl(lesson.image, 1024, 640)}
                    alt=""
                    aria-hidden="true"
                    width={1024}
                    height={640}
                    loading="eager"
                    decoding="async"
                    onLoad={() => setIsModalImageLoading(false)}
                    onError={() => setIsModalImageLoading(false)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`h-full w-full bg-linear-to-br ${style.gradient}`}
                  />
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute right-8 bottom-8 left-8">
                  <h2
                    id={modalTitleId}
                    className="text-3xl font-black tracking-tight text-white uppercase drop-shadow-2xl sm:text-4xl"
                  >
                    {title}
                  </h2>
                </div>
              </div>

              <div className="bg-white p-8 sm:p-12">
                <div className="mb-6 flex items-center gap-3 text-gray-700">
                  <div
                    aria-hidden="true"
                    className={`h-8 w-1 rounded-full bg-linear-to-b ${style.gradient}`}
                  />
                  <AlignLeft size={20} aria-hidden="true" />
                  <span className="text-xs font-black tracking-[0.2em] uppercase">
                    {texts.details[currentLang]}
                  </span>
                </div>

                <p className="text-xl leading-relaxed font-medium text-gray-700">
                  {description || texts.fallbackDescription[currentLang]}
                </p>

                <div className="mt-10 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={`cursor-pointer rounded-2xl bg-linear-to-r px-8 py-4 font-black tracking-widest text-white uppercase shadow-lg transition-transform focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-700 active:scale-95 ${style.gradient} ${style.shadow}`}
                  >
                    {texts.understood[currentLang]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
