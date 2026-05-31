import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Clock, MapPin, Users, Loader2, Baby } from "lucide-react";

import { fetchProgramsAdults } from "../../../services/programsAdultsService"; 
import { programsService } from "../../../services/programsService";

import type { ProgramAdults } from "../../../types/program";
import type { Program } from "../../../types/program";
import type { LangKey } from "../../../types/types";

export const ProgramsSection = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as LangKey;

  const texts = {
    sectionTitle: { ua: "Наші програми та курси", de: "Unsere Programme & Kurse", en: "Our Programs & Courses" },
    adultsTitle: { ua: "Для дорослих", de: "Für Erwachsene", en: "For Adults" },
    kidsTitle: { ua: "Для дітей", de: "Für Kinder", en: "For Kids" },
    allCoursesBtn: { ua: "Всі програми", de: "Alle Programme", en: "All Programs" },
    allProgramsBtn: { ua: "Всі програми", de: "Alle Programme", en: "All Programs" }
  };

  const [nextProgramAdult, setNextProgramAdult] = useState<ProgramAdults | null>(null);
  const [kidsPrograms, setKidsPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [adultsData, kidsData]: [ProgramAdults[], Program[]] = await Promise.all([
          fetchProgramsAdults(),
          programsService.getPrograms()
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

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
  );

  return (
    <section className="w-full px-4 md:px-8 mb-20 font-nunito">
      
      {/* ГОЛОВНИЙ ЗАГОЛОВОК СЕКЦІЇ */}
      <div className="mb-12 flex items-center justify-between text-center">
        <h2 className="text-3xl md:text-4xl w-full text-preset-2 font-nunito text-gray-900 font-extrabold uppercase tracking-tight">
          {texts.sectionTitle[currentLang]}
        </h2>
      </div>

      {/* ГЛОБАЛЬНИЙ КОНТЕЙНЕР КАРТОК */}
      <div className="flex flex-col gap-8 w-full font-nunito">
        
        {/* 1. КАРТКА: ДЛЯ ДОРОСЛИХ */}
        <div className="relative flex flex-col lg:flex-row items-stretch overflow-hidden rounded-[2.5rem] border border-emerald-200/50 bg-emerald-50/50 shadow-xl transition-all duration-300 hover:bg-emerald-100/40">
          
          {/* Ліва частина: ЗАГОЛОВОК БЛОКУ */}
          <div className="flex flex-row lg:flex-col items-center justify-center text-center gap-4 lg:w-[200px] shrink-0 border-b lg:border-b-0 lg:border-r border-emerald-100/40 p-6 md:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm border border-emerald-100">
              <GraduationCap size={26} />
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-tight">
              {texts.adultsTitle[currentLang]}
            </h3>
          </div>

          {/* Центральна частина: Контент */}
          <div className="flex-1 flex flex-col justify-center gap-4 p-6 md:p-8 py-6 lg:py-6 min-w-0">
            {nextProgramAdult && (
              <>
                <div className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-3 py-1.5 text-xs font-black text-emerald-700 uppercase tracking-wider shadow-sm border border-emerald-100/30">
                  <Clock size={14} className="text-emerald-600" /> 
                  <span className="translate-y-[1px] leading-none">{nextProgramAdult.dateRange}</span>
                </div>

                <h4 className="text-xl md:text-2xl font-black text-slate-800 leading-tight tracking-tight">
                  {nextProgramAdult.title[currentLang]}
                </h4>

                <p className="line-clamp-3 text-[15px] text-slate-600 font-medium leading-relaxed">
                  {nextProgramAdult.description[currentLang]}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-3 border border-emerald-100/40 shadow-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <MapPin size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-none mb-0.5">Локація</span>
                      <span className="text-sm font-bold text-slate-700 truncate leading-tight">{nextProgramAdult.location[currentLang]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-3 border border-emerald-100/40 shadow-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Users size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-none mb-0.5">Місткість групи</span>
                      <span className="text-sm font-bold text-slate-700 truncate leading-tight">{nextProgramAdult.capacity[currentLang]}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ЗОБРАЖЕННЯ КУРСУ */}
          {nextProgramAdult && (
            <div className="relative w-full h-56 lg:h-auto lg:w-[280px] shrink-0 overflow-hidden bg-slate-100 order-first lg:order-none border-b lg:border-b-0 lg:border-l border-emerald-100/30">
              {nextProgramAdult.image ? (
                <img src={nextProgramAdult.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white text-emerald-600 min-h-[160px]">
                  <GraduationCap size={32} />
                </div>
              )}
            </div>
          )}

          {/* Права частина: КНОПКА ВИРІВНЯНА ЦЕНТРОВАНО ВЕРТИКАЛЬНО Й ГОРИЗОНТАЛЬНО */}
          <div className="flex items-center justify-center lg:w-[220px] shrink-0 p-6 md:p-8 lg:p-0 mx-auto lg:mx-0 w-full max-w-md lg:max-w-none border-t lg:border-t-0 border-emerald-100/40 lg:border-l border-emerald-100/20">
            <Link to="/programs/adults" className="w-full lg:w-auto mx-6 lg:mx-0 flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all duration-300 active:scale-[0.97] shadow-md text-center whitespace-nowrap shrink-0">
              <span className="translate-y-[1px] leading-none">{texts.allCoursesBtn[currentLang]}</span>
              <ArrowRight size={16} className="shrink-0" />
            </Link>
          </div>
        </div>


        {/* 2. КАРТКА: ДЛЯ ДІТЕЙ */}
        <div className="relative flex flex-col lg:flex-row items-stretch overflow-hidden rounded-[2.5rem] border border-amber-200/50 bg-amber-50/50 shadow-xl transition-all duration-300 hover:bg-amber-100/40">
          
          {/* Ліва частина: ЗАГОЛОВОК БЛОКУ */}
          <div className="flex flex-row lg:flex-col items-center justify-center text-center gap-4 lg:w-[200px] shrink-0 border-b lg:border-b-0 lg:border-r border-amber-100/60 p-6 md:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-md border border-amber-100">
              <Baby size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-tight">
              {texts.kidsTitle[currentLang]}
            </h3>
          </div>

          {/* Центральна частина: Список програм (СТАТИЧНИЙ) */}
          <div className="flex-1 flex flex-col justify-center p-6 md:p-8 py-6 lg:py-6 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kidsPrograms.map((prog) => (
                <div 
                  key={prog.id} 
                  className="flex items-center gap-3 rounded-2xl bg-white p-2.5 border border-amber-100/40 shadow-sm min-w-0"
                >
                   {/* Фото */}
                   <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100 shadow-sm">
                     {prog.image ? (
                       <img src={prog.image} alt="" className="h-full w-full object-cover" />
                     ) : (
                       <div className="flex h-full w-full items-center justify-center bg-amber-50 text-amber-600">
                         <Baby size={16} />
                       </div>
                     )}
                   </div>
                   <span className="text-[14px] font-bold text-slate-700 truncate lg:text-wrap leading-tight translate-y-[1px]">
                     {prog.title[currentLang]}
                   </span>
                </div>
              ))}
            </div>
          </div>

          {/* Права частина: КНОПКА ВИРІВНЯНА ЦЕНТРОВАНО ВЕРТИКАЛЬНО Й ГОРИЗОНТАЛЬНО */}
          <div className="flex items-center justify-center lg:w-[220px] shrink-0 p-6 md:p-8 lg:p-0 mx-auto lg:mx-0 w-full max-w-md lg:max-w-none border-t lg:border-t-0 border-amber-100/20 lg:border-l">
            <Link to="/programs/kids" className="w-full lg:w-auto mx-6 lg:mx-0 flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all duration-300 active:scale-[0.97] shadow-md text-center whitespace-nowrap shrink-0">
              <span className="translate-y-[1px] leading-none">{texts.allProgramsBtn[currentLang]}</span>
              <ArrowRight size={16} className="shrink-0" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};