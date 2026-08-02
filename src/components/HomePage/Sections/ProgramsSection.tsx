import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Baby,
  Clock,
  GraduationCap,
  Loader2,
  MapPin,
  Users,
} from "lucide-react";

import { fetchProgramsAdults } from "../../../services/programsAdultsService";
import { programsService } from "../../../services/programsService";

import type { ProgramAdults, Program } from "../../../types/program";
import type { LangKey } from "../../../types/types";

export const ProgramsSection = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as LangKey;

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

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <section className="font-nunito mb-20 w-full md:p-4">
      <div className="mb-12 flex items-center justify-between text-center">
        <h2 className="text-preset-2 font-nunito w-full text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
          {texts.sectionTitle[currentLang]}
        </h2>
      </div>

      <div className="font-nunito grid w-full grid-cols-1 gap-8 lg:auto-rows-fr">
        <div className="group relative flex h-full flex-col items-stretch overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 lg:flex-row">
          <div className="flex shrink-0 flex-row items-center justify-center gap-4 border-b border-gray-200 p-6 text-center md:p-8 lg:w-50 lg:flex-col lg:border-r lg:border-b-0">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-600 shadow-sm">
              <GraduationCap size={26} />
            </div>
            <h3 className="text-xl leading-tight font-black tracking-tight text-slate-800 uppercase">
              {texts.adultsTitle[currentLang]}
            </h3>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 p-6 md:p-8 lg:py-6">
            {nextProgramAdult && (
              <>
                <div className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-100/30 bg-white px-3 py-1.5 text-xs font-black tracking-wider text-emerald-700 uppercase shadow-sm">
                  <Clock size={14} className="text-emerald-600" />
                  <span className="leading-none text-black">
                    {nextProgramAdult.dateRange}
                  </span>
                </div>

                <h4 className="text-xl leading-tight font-black tracking-tight text-slate-800 md:text-2xl">
                  {nextProgramAdult.title[currentLang]}
                </h4>

                <p className="line-clamp-3 text-[15px] leading-relaxed font-medium text-slate-600">
                  {nextProgramAdult.description[currentLang]}
                </p>

                <div className="mt-1 grid w-full grid-cols-1 gap-3 xl:grid-cols-2">
                  <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-100/40 bg-white/90 p-3 shadow-sm">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <MapPin size={16} />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="mb-0.5 text-[10px] leading-none font-black tracking-wider text-slate-400 uppercase">
                        Локація
                      </span>
                      <span className="truncate text-sm leading-tight font-bold text-slate-700">
                        {nextProgramAdult.location[currentLang]}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-100/40 bg-white/90 p-3 shadow-sm">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Users size={16} />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="mb-0.5 text-[10px] leading-none font-black tracking-wider text-slate-400 uppercase">
                        Місткість групи
                      </span>
                      <span className="truncate text-sm leading-tight font-bold text-slate-700">
                        {nextProgramAdult.capacity[currentLang]}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {nextProgramAdult && (
            <div className="relative order-first h-64 w-full shrink-0 overflow-hidden border-b border-emerald-100/40 md:h-104 lg:order-0 lg:h-auto lg:w-[320px] lg:border-b-0">
              {nextProgramAdult.image ? (
                <>
                  <img
                    src={nextProgramAdult.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-100/50 text-emerald-600">
                  <GraduationCap size={40} />
                </div>
              )}
            </div>
          )}

          <div className="mx-auto flex w-full max-w-md shrink-0 items-center justify-center border-t border-emerald-100/40 p-6 md:p-8 lg:mx-0 lg:w-55 lg:max-w-none lg:border-t-0 lg:border-l lg:border-emerald-100/20 lg:p-0">
            <Link
              to="/programs/adults"
              className="mx-6 flex w-full shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-xl bg-slate-900 px-6 py-4 text-center text-xs font-black tracking-widest text-white uppercase shadow-md transition-all duration-250 hover:bg-blue-600 active:scale-[0.97] lg:mx-0 lg:w-auto"
            >
              <span className="translate-y-px leading-none">
                {texts.allCoursesBtn[currentLang]}
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="group relative flex h-full flex-col items-stretch overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 lg:flex-row">
          <div className="flex shrink-0 flex-row items-center justify-center gap-4 border-b border-amber-100/60 p-6 text-center md:p-8 lg:w-50 lg:flex-col lg:border-r lg:border-b-0">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-amber-100 bg-white text-amber-600 shadow-md">
              <Baby size={24} />
            </div>
            <h3 className="text-xl leading-tight font-black tracking-tight text-slate-800 uppercase">
              {texts.kidsTitle[currentLang]}
            </h3>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center p-6 md:p-8 lg:h-full lg:py-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:h-full lg:auto-rows-fr">
              {kidsPrograms.map((program) => (
                <div
                  key={program.id}
                  className="flex h-full min-w-0 items-center gap-3 rounded-2xl border border-amber-100/40 bg-white p-2.5 shadow-sm transition-all lg:p-4"
                >
                  <div className="size-9 shrink-0 overflow-hidden rounded-md border border-slate-100 bg-slate-100 shadow-sm lg:size-12 lg:rounded-xl">
                    {program.image ? (
                      <img
                        src={program.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-amber-50 text-amber-600">
                        <Baby size={16} />
                      </div>
                    )}
                  </div>
                  <span className="translate-y-px truncate text-[14px] leading-tight font-bold text-slate-700 lg:text-[15px] lg:text-wrap">
                    {program.title[currentLang]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-md shrink-0 items-center justify-center border-t border-amber-100/20 p-6 md:p-8 lg:mx-0 lg:w-55 lg:max-w-none lg:border-t-0 lg:border-l lg:p-0">
            <Link
              to="/programs/kids"
              className="mx-6 flex w-full shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-xl bg-slate-900 px-6 py-4 text-center text-xs font-black tracking-widest text-white uppercase shadow-md transition-all duration-300 hover:bg-amber-600 active:scale-[0.97] lg:mx-0 lg:w-auto"
            >
              <span className="translate-y-px leading-none">
                {texts.allProgramsBtn[currentLang]}
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
