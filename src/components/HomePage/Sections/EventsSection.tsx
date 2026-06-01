import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CalendarDays, Loader2, Clock, MapPin } from "lucide-react";

import { fetchEvents } from "../../../services/eventsService";
import type { Event } from "../../../types/event";
import type { LangKey } from "../../../types/types";

export const EventsSection = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as LangKey;
  
  const dateLocale = currentLang === 'ua' ? 'uk-UA' : currentLang === 'de' ? 'de-DE' : 'en-US';

  const texts = {
    sectionTitle: { ua: "Анонси та події", de: "Ankündigungen & Events", en: "Announcements & Events" },
    
    // Три рівні майбутніх подій
    upcomingBadge: { ua: "Найближча подія", de: "Nächste Veranstaltung", en: "Upcoming Event" },
    soonBadge: { ua: "Незабаром", de: "Demnächst", en: "Soon" },
    futureBadge: { ua: "Майбутня подія", de: "Kommendes Event", en: "Future Event" },
    
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
          // Фільтруємо ТІЛЬКИ майбутні події, щоб минулі зникали автоматично
          const upcomingEvents = eventsData
            .filter((e) => new Date(e.date).getTime() >= today.getTime())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          // Відображаємо перші 3 штуки
          setEventsList(upcomingEvents.slice(0, 3));
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
    <section className="w-full md:p-4 mb-20 font-nunito">
      
      {/* ГОЛОВНИЙ ЗАГОЛОВОК */}
      <div className="mb-12 flex items-center justify-between text-center">
        <h2 className="text-3xl md:text-4xl w-full text-preset-2 font-nunito text-gray-900 font-semibold tracking-tight">
          {texts.sectionTitle[currentLang]}
        </h2>
      </div>

      {/* СІТКА КАРТОК (як у EventCard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full font-nunito">
        {eventsList.map((event, index) => {
          
          // Динамічний розподіл назв бейджів за індексом черги
          let badgeText = texts.futureBadge[currentLang]; // Для 3-ї картки (індекс 2)
          if (index === 0) badgeText = texts.upcomingBadge[currentLang]; // Для 1-ї картки
          else if (index === 1) badgeText = texts.soonBadge[currentLang]; // Для 2-ї картки

          return (
            <div 
              key={event.id} 
              className="group relative flex w-full flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
            >
              
              {/* КОНТЕЙНЕР ЗОБРАЖЕННЯ */}
              <div className="relative h-64 overflow-hidden shrink-0">
                <img
                  src={event.imageBanner}
                  alt={event.titles[currentLang]}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Градієнт поверх фото для глибини */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />

                {/* Бейджі поверх фото */}
                <div className="absolute bottom-4 left-4 flex flex-col items-start gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    {badgeText}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-black/40 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
                    <CalendarDays size={14} />
                    {new Date(event.date).toLocaleDateString(dateLocale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* КОНТЕНТ */}
              <div className="flex grow flex-col p-6">
                <h3 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                  {event.titles[currentLang]}
                </h3>

                {/* Інфо-панель */}
                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-blue-500" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-red-500" />
                    <span className="max-w-[150px] truncate">{event.location}</span>
                  </div>
                </div>

                {/* БЛОК ОПИСУ */}
                <div className="relative mb-6">
                  <p className="min-h-[5.5rem] line-clamp-4 text-sm text-gray-500">
                    {event.descriptions[currentLang]}
                  </p>
                </div>

                {/* КНОПКА "ЧИТАТИ БІЛЬШЕ" */}
                <Link 
                  to={`/events/${event.id}`} 
                  className="mt-auto group/btn flex items-center justify-center gap-3 rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:shadow-lg active:scale-95"
                >
                  <div className="inline-flex items-center text-sm font-bold tracking-wider text-white uppercase">
                    {texts.detailsBtn[currentLang]}
                    <span className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};