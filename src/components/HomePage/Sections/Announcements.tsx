import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  GraduationCap, 
  Clock, 
  MapPin, 
  Users, 
  CalendarDays,
  Loader2,
  Baby
} from "lucide-react";

// Сервіси
import { fetchEvents } from "../../../services/eventsService";
import { fetchProgramsAdults } from "../../../services/programsAdultsService"; 
import { programsService } from "../../../services/programsService";

// Типи
import type { Event } from "../../../types/event";
import type { ProgramAdults } from "../../../types/program";
import type { Program } from "../../../types/program";
import type { LangKey } from "../../../types/types";

export const Announcements = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as LangKey;
  
  const dateLocale = currentLang === 'ua' ? 'uk-UA' : currentLang === 'de' ? 'de-DE' : 'en-US';

  const texts = {
    sectionTitle: { ua: "Анонси та події", de: "Ankündigungen & Events", en: "Announcements & Events" },
    upcomingBadge: { ua: "Найближчий захід", de: "Nächste Veranstaltung", en: "Upcoming Event" },
    pastBadge: { ua: "Минула подія", de: "Vergangene Veranstaltung", en: "Past Event" },
    detailsBtn: { ua: "Детальніше", de: "Details", en: "Details" },
    adultsTitle: { ua: "Для дорослих", de: "Für Erwachsene", en: "For Adults" },
    kidsTitle: { ua: "Для дітей", de: "Für Kinder", en: "For Kids" },
    allCoursesBtn: { ua: "Усі курси", de: "Alle Kurse", en: "All Courses" },
    allProgramsBtn: { ua: "Всі програми", de: "Alle Programme", en: "All Programs" }
  };

  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [nextProgramAdult, setNextProgramAdult] = useState<ProgramAdults | null>(null);
  const [kidsPrograms, setKidsPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
        const [eventsData, adultsData, kidsData]: [Event[], ProgramAdults[], Program[]] = await Promise.all([
          fetchEvents(),
          fetchProgramsAdults(),
          programsService.getPrograms()
        ]);

        // 1. Події (Майбутня або остання минула)
        if (eventsData?.length > 0) {
          const upcoming = eventsData
            .filter((e) => new Date(e.date).getTime() >= today.getTime())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          setNextEvent(upcoming.length > 0 ? upcoming[0] : [...eventsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]);
        }

        // 2. Дорослі (Остання додана)
        if (adultsData?.length > 0) {
          setNextProgramAdult(adultsData[adultsData.length - 1]);
        }

        // 3. Діти (Список до 10 штук)
        if (kidsData?.length > 0) {
          setKidsPrograms(kidsData.slice(0, 10));
        }

      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const isUpcoming = nextEvent && new Date(nextEvent.date).getTime() >= new Date().setHours(0,0,0,0);

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
  );

  return (
    <section className="max-w-full px-4 mb-20 font-nunito">
      <div className="mb-12 flex items-center text-center justify-between">
        <h2 className="text-3xl md:text-4xl w-full text-preset-2 font-nunito text-gray-900">
          {texts.sectionTitle[currentLang]}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        
        {/* КАРТКА 1: ПОДІЯ */}
        <div className="group relative flex flex-col overflow-hidden rounded-4xl bg-white border border-gray-100 shadow-xl transition-all hover:shadow-2xl">
          {nextEvent && (
            <>
              <div className="relative h-64 overflow-hidden">
                <img src={nextEvent.imageBanner} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                <div className="absolute top-6 left-6 flex flex-col items-center rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur-sm min-w-[70px]">
                  <span className="text-blue-600 font-bold uppercase text-[10px] tracking-widest">
                    {new Date(nextEvent.date).toLocaleDateString(dateLocale, { month: 'short' })}
                  </span>
                  <span className="text-3xl font-black text-gray-900">{new Date(nextEvent.date).getDate()}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-8">
                <div className="mb-3 flex items-center gap-2 text-blue-600 font-bold uppercase text-[10px] tracking-widest">
                  <CalendarDays size={16} />
                  <span>{isUpcoming ? texts.upcomingBadge[currentLang] : texts.pastBadge[currentLang]}</span>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{nextEvent.titles[currentLang]}</h3>
                <p className="mb-6 line-clamp-2 text-sm text-gray-500 italic">{nextEvent.descriptions[currentLang]}</p>
                <Link to={`/events/${nextEvent.id}`} className="mt-auto flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-900 hover:text-blue-600">
                  {texts.detailsBtn[currentLang]} <ArrowRight size={16} />
                </Link>
              </div>
            </>
          )}
        </div>

        {/* КАРТКА 2: ПРОГРАМИ ДЛЯ ДОРОСЛИХ */}
        <div className="relative flex flex-col overflow-hidden rounded-4xl bg-green-900 p-8 text-white shadow-xl">
          <GraduationCap className="absolute -right-10 -top-10 text-white/5 rotate-12" size={200} />
          <div className="relative z-10 flex flex-1 flex-col">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-gray-900">
              <GraduationCap size={28} />
            </div>
            <h3 className="mb-6 text-2xl font-black text-yellow-400 uppercase tracking-tighter">
              {texts.adultsTitle[currentLang]}
            </h3>
            {nextProgramAdult && (
              <div className="rounded-2xl bg-white/5 p-5 border border-white/10 backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2 text-[14px] font-bold text-yellow-400/80 uppercase">
                  <Clock size={14} /> {nextProgramAdult.dateRange}
                </div>
                <h4 className="mb-2 text-lg font-bold leading-tight">{nextProgramAdult.title[currentLang]}</h4>
                <p className="line-clamp-3 text-[14px] text-gray-300 italic mb-4">{nextProgramAdult.description[currentLang]}</p>
                <div className="space-y-1 text-[12px] text-gray-300 font-bold uppercase">
                  <div className="flex items-center gap-2"><MapPin size={12} className="text-yellow-400" /> {nextProgramAdult.location[currentLang]}</div>
                  <div className="flex items-center gap-2"><Users size={12} className="text-yellow-400" /> {nextProgramAdult.capacity[currentLang]}</div>
                </div>
              </div>
            )}
            <Link to="/programs/adults" className="mt-8 flex items-center justify-between rounded-xl bg-yellow-400 p-4 text-sm font-bold text-gray-900 hover:bg-yellow-500 transition-all">
              {texts.allCoursesBtn[currentLang]} <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* КАРТКА 3: ПРОГРАМИ ДЛЯ ДІТЕЙ */}
        <div className="relative flex flex-col overflow-hidden rounded-4xl bg-blue-600 p-8 text-white shadow-xl">
          <Baby className="absolute -right-10 -top-10 text-white/10 -rotate-12" size={200} />
          <div className="relative z-10 flex flex-1 flex-col">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-lg">
              <Baby size={28} />
            </div>
            <h3 className="mb-6 text-2xl font-black text-white uppercase tracking-tighter">
              {texts.kidsTitle[currentLang]}
            </h3>
            <div className="flex-1 space-y-3">
              {kidsPrograms.map((prog) => (
                <div key={prog.id} className="flex items-center gap-3 rounded-xl bg-white/10 p-3 border border-white/10 transition-colors hover:bg-white/20">
                   <div className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                   <span className="text-sm font-bold truncate leading-none">
                     {prog.title}
                   </span>
                </div>
              ))}
            </div>
            <Link to="/programs/kids" className="mt-8 flex items-center justify-between rounded-xl bg-yellow-400 p-4 text-sm font-bold text-black hover:bg-yellow-500 transition-all">
              {texts.allProgramsBtn[currentLang]} <ArrowRight size={18} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};