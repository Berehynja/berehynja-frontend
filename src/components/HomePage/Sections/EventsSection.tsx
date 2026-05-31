import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Loader2 } from "lucide-react";

import { fetchEvents } from "../../../services/eventsService";
import type { Event } from "../../../types/event";
import type { LangKey } from "../../../types/types";

export const EventsSection = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as LangKey;
  
  const dateLocale = currentLang === 'ua' ? 'uk-UA' : currentLang === 'de' ? 'de-DE' : 'en-US';

  const texts = {
    sectionTitle: { ua: "Анонси та події", de: "Ankündigungen & Events", en: "Announcements & Events" },
    upcomingBadge: { ua: "Найближчий захід", de: "Nächste Veranstaltung", en: "Upcoming Event" },
    pastBadge: { ua: "Минула подія", de: "Vergangene Veranstaltung", en: "Past Event" },
    detailsBtn: { ua: "Детальніше", de: "Details", en: "Details" }
  };

  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
        const eventsData: Event[] = await fetchEvents();

        if (eventsData?.length > 0) {
          const upcoming = eventsData
            .filter((e) => new Date(e.date).getTime() >= today.getTime())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          const past = eventsData
            .filter((e) => new Date(e.date).getTime() < today.getTime())
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          const combinedEvents = [...upcoming, ...past].slice(0, 3);
          setEventsList(combinedEvents);
        }
      } catch (error) {
        console.error("Помилка завантаження подій:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
  );

  if (eventsList.length === 0) return null;

  return (
    <section className="w-full mb-20 font-nunito">
      <div className="mb-12 flex items-center justify-between text-center">
        <h2 className="text-3xl md:text-4xl w-full text-preset-2 font-nunito text-gray-900 font-semibold tracking-tight">
          {texts.sectionTitle[currentLang]}
        </h2>
      </div>

      <div className="flex flex-col gap-8 w-full font-nunito">
        {eventsList.map((event) => {
          const isUpcoming = new Date(event.date).getTime() >= new Date().setHours(0,0,0,0);

          return (
            <div 
              key={event.id} 
              className="relative flex flex-col lg:flex-row items-stretch overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-slate-50/50 shadow-xl transition-all duration-300 hover:bg-slate-100/40"
            >
              {/* Левая часть: Дата */}
              <div className="flex flex-row lg:flex-col items-center justify-center text-center gap-4 lg:w-[200px] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100/60 p-6 md:p-8">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-3 shadow-md border border-slate-100 min-w-[75px] h-16">
                  <span className="text-blue-600 font-black uppercase text-[11px] tracking-widest leading-none translate-y-[1px]">
                    {new Date(event.date).toLocaleDateString(dateLocale, { month: 'short' })}
                  </span>
                  <span className="text-2xl font-black text-gray-900">{new Date(event.date).getDate()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 font-black uppercase text-[10px] tracking-wider bg-white px-2.5 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                  <CalendarDays size={14} />
                  <span className="translate-y-[0.5px] leading-none">
                    {isUpcoming ? texts.upcomingBadge[currentLang] : texts.pastBadge[currentLang]}
                  </span>
                </div>
              </div>

              {/* Центральная часть: Текст */}
              <div className="flex-1 flex flex-col justify-center gap-2 p-6 md:p-8 py-6 lg:py-6 min-w-0">
                <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight tracking-tight">
                  {event.titles[currentLang]}
                </h3>
                <p className="line-clamp-2 text-[15px] text-slate-600 font-medium italic leading-relaxed">
                  {event.descriptions[currentLang]}
                </p>
              </div>

              {/* ИЗОБРАЖЕНИЕ СОБЫТИЯ: добавлен минимальный верхний паддинг и скругление углов */}
              <div className="relative w-full h-56 lg:h-auto lg:w-[280px] shrink-0 overflow-hidden order-first lg:order-none pt-4 pb-2 px-4 lg:pt-3 lg:pb-3 lg:pl-0 lg:pr-4 flex items-stretch">
                <img 
                  src={event.imageBanner} 
                  className="h-full w-full object-cover rounded-2xl border border-slate-200/40 shadow-sm" 
                  alt="" 
                />
              </div>

              {/* Правая часть: Кнопка */}
              <div className="flex items-center justify-center lg:w-[220px] shrink-0 p-6 md:p-8 lg:p-0 mx-auto lg:mx-0 w-full max-w-md lg:max-w-none border-t lg:border-t-0 border-slate-100/40 lg:border-l">
                <Link 
                  to={`/events/${event.id}`} 
                  className="w-full lg:w-auto mx-6 lg:mx-0 flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all duration-300 active:scale-[0.97] shadow-md text-center whitespace-nowrap shrink-0"
                >
                  <span className="translate-y-[1px] leading-none">{texts.detailsBtn[currentLang]}</span>
                  <ArrowRight size={16} className="shrink-0" />
                </Link>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};