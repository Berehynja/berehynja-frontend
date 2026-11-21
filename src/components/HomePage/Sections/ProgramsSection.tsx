import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Baby,
  Clock,
  GraduationCap,
  MapPin,
  Users,
} from "lucide-react";

import { PageLoader } from "../../ui/PageLoader";
import { optimizeCloudinaryImage } from "../../../services/cloudinaryService";
import { fetchProgramsAdults } from "../../../services/programsAdultsService";
import { programsService } from "../../../services/programsService";
import type { ProgramAdults, Program } from "../../../types/program";
import type { LangKey } from "../../../types/types";

const getAdultImageUrl = (url: string, width: number) =>
  optimizeCloudinaryImage(
    url,
    `f_auto,q_auto:good,c_limit,w_${width}`,
  );

const getProgramIconUrl = (url: string) =>
  optimizeCloudinaryImage(
    url,
    "f_auto,q_auto:good,c_limit,w_480",
  );

export const ProgramsSection = () => {
  const { i18n } = useTranslation();
  const currentLang = (
    i18n.resolvedLanguage || i18n.language
  ).split("-")[0] as LangKey;

  const texts = {
    sectionTitle: {
      ua: "Наші програми та курси",
      de: "Unsere Programme & Kurse",
      en: "Our Programs & Courses",
    },
    adultsTitle: {
      ua: "Для дорослих",
      de: "Für Erwachsene",
      en: "For Adults",
    },
    kidsTitle: {
      ua: "Для дітей",
      de: "Für Kinder",
      en: "For Kids",
    },
    allCoursesBtn: {
      ua: "Всі курси",
      de: "Alle Kurse",
      en: "All Courses",
    },
    allProgramsBtn: {
      ua: "Всі програми",
      de: "Alle Programme",
      en: "All Programs",
    },
    locationLabel: {
      ua: "Локація",
      de: "Standort",
      en: "Location",
    },
    capacityLabel: {
      ua: "Місткість групи",
      de: "Gruppengröße",
      en: "Group capacity",
    },
  };

  const [nextProgramAdult, setNextProgramAdult] =
    useState<ProgramAdults | null>(null);
  const [kidsPrograms, setKidsPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [adultsData, kidsData]: [ProgramAdults[], Program[]] =
          await Promise.all([
            fetchProgramsAdults(),
            programsService.getPrograms(),
          ]);

        if (adultsData?.length > 0) {
          setNextProgramAdult(adultsData[adultsData.length - 1]);
        }

        if (kidsData?.length > 0) {
          setKidsPrograms(kidsData.slice(0, 6));
        }
      } catch (error) {
        console.error("Помилка завантаження програм:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  if (loading) return <PageLoader visible fullscreen={false} />;

  return (
    <section className="font-nunito w-full md:p-4">
      <div className="mb-12 flex items-center justify-between text-center">
        <h2 className="text-preset-2 font-nunito w-full text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
          {texts.sectionTitle[currentLang]}
        </h2>
      </div>

      <div className="font-nunito grid w-full grid-cols-1 gap-8 lg:auto-rows-fr">
        <div className="group relative flex min-h-0 flex-col overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Заголовок — окрема смуга, не стискає інформацію */}
          <div className="flex items-center justify-center gap-4 border-b border-gray-200 px-6 py-5 text-center md:justify-start md:px-8">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
              <GraduationCap size={26} aria-hidden="true" />
            </div>
            <h3 className="text-xl leading-tight font-black tracking-tight text-slate-800 uppercase">
              {texts.adultsTitle[currentLang]}
            </h3>
          </div>

          {nextProgramAdult && (
            <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)]">
              {/* Фото займає власну область зі стабільними пропорціями */}
              <div className="relative aspect-4/3 min-w-0 overflow-hidden bg-slate-100 sm:aspect-video lg:aspect-auto">
                {nextProgramAdult.image ? (
                  <>
                    <img
                      src={getAdultImageUrl(nextProgramAdult.image, 640)}
                      srcSet={`${getAdultImageUrl(nextProgramAdult.image, 480)} 480w, ${getAdultImageUrl(nextProgramAdult.image, 640)} 640w, ${getAdultImageUrl(nextProgramAdult.image, 960)} 960w`}
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      alt={nextProgramAdult.title[currentLang]}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-emerald-100/50 text-emerald-700">
                    <GraduationCap size={40} aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Інформація про курс — без стискання */}
              <div className="flex min-w-0 flex-col gap-4 p-5 sm:p-7 xl:p-8">
                <div className="inline-flex max-w-full items-center gap-2 self-start rounded-xl border border-emerald-100/40 bg-white px-3 py-2 text-xs font-black tracking-wide text-emerald-800 shadow-sm">
                  <Clock size={15} className="shrink-0" aria-hidden="true" />
                  <span className="min-w-0 wrap-break-words text-slate-900">
                    {nextProgramAdult.dateRange}
                  </span>
                </div>

                <h4 className="text-xl leading-tight font-black tracking-tight wrap-break-words text-slate-800 md:text-2xl">
                  {nextProgramAdult.title[currentLang]}
                </h4>

                <p className="line-clamp-4 text-[15px] leading-relaxed font-medium text-slate-600">
                  {nextProgramAdult.description[currentLang]}
                </p>

                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                  <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-100/40 bg-white/90 p-3 shadow-sm">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <MapPin size={16} aria-hidden="true" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="mb-1 text-xs leading-none font-black tracking-wide text-slate-600 uppercase">
                        {texts.locationLabel[currentLang]}
                      </span>
                      <span className="min-w-0 wrap-break-words text-sm leading-tight font-bold text-slate-700">
                        {nextProgramAdult.location[currentLang]}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-100/40 bg-white/90 p-3 shadow-sm">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Users size={16} aria-hidden="true" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="mb-1 text-xs leading-none font-black tracking-wide text-slate-600 uppercase">
                        {texts.capacityLabel[currentLang]}
                      </span>
                      <span className="min-w-0 wrap-break-words text-sm leading-tight font-bold text-slate-700">
                        {nextProgramAdult.capacity[currentLang]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Спільний нижній ряд: кнопка не впливає на висоту фотографії */}
          <div className="mt-auto flex justify-center border-t border-gray-200 px-5 py-4 sm:px-7 xl:px-8">
            <Link
              to="/programs/adults"
              className="group/btn inline-flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-3.5 text-center text-sm font-bold tracking-wide text-white uppercase shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:scale-[0.98] sm:w-60"
            >
              <span>{texts.allCoursesBtn[currentLang]}</span>
              <ArrowRight size={17} className="shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="group relative flex min-h-0 flex-col overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Такий самий верхній заголовок, як у блоці для дорослих */}
          <div className="flex items-center justify-center gap-4 border-b border-gray-200 px-6 py-5 text-center md:justify-start md:px-8">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-amber-100 bg-white text-amber-700 shadow-sm">
              <Baby size={24} aria-hidden="true" />
            </div>
            <h3 className="text-xl leading-tight font-black tracking-tight text-slate-800 uppercase">
              {texts.kidsTitle[currentLang]}
            </h3>
          </div>

          {/* Програми на повній ширині: жодної вузької бічної колонки */}
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 p-4 sm:p-5 md:grid-cols-2 md:grid-rows-3 md:gap-3 xl:p-6">
            {kidsPrograms.map((program) => (
              <div
                key={program.id}
                className="flex min-h-19 min-w-0 items-stretch overflow-hidden rounded-2xl border border-amber-100/60 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative w-20 shrink-0 self-stretch overflow-hidden rounded-l-2xl rounded-r-none bg-slate-100 sm:w-24">
                  {program.image ? (
                    <img
                      src={getProgramIconUrl(program.image)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-amber-50 text-amber-700">
                      <Baby size={20} aria-hidden="true" />
                    </div>
                  )}
                </div>

                <span className="flex min-w-0 flex-1 items-center px-3 py-2 text-[clamp(1.125rem,calc(0.75rem+1.15vw),1.625rem)] leading-snug font-bold tracking-tight text-slate-800 sm:px-4">
                  {program.title[currentLang]}
                </span>
              </div>
            ))}
          </div>

          {/* Такий самий нижній ряд, як у блоці для дорослих */}
          <div className="mt-auto flex justify-center border-t border-gray-200 px-5 py-4 sm:px-7 xl:px-8">
            <Link
              to="/programs/kids"
              className="group/btn inline-flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-3.5 text-center text-sm font-bold tracking-wide text-white uppercase shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 active:scale-[0.98] sm:w-60"
            >
              <span>{texts.allProgramsBtn[currentLang]}</span>
              <ArrowRight size={17} className="shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};