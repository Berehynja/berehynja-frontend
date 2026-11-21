
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";

import { PageLoader } from "../../ui/PageLoader";
import { fetchEvents } from "../../../services/eventsService";
import type { Event } from "../../../types/event";
import type { LangKey } from "../../../types/types";

const DATE_LOCALES: Record<LangKey, string> = {
  ua: "uk-UA",
  de: "de-DE",
  en: "en-US",
};

const getCurrentLanguage = (language: string): LangKey => {
  const normalizedLanguage = language
    .split("-")[0]
    .toLowerCase();

  if (
    normalizedLanguage === "ua" ||
    normalizedLanguage === "de" ||
    normalizedLanguage === "en"
  ) {
    return normalizedLanguage;
  }

  return "ua";
};

const TEXTS = {
  sectionTitle: {
    ua: "Анонси та події",
    de: "Ankündigungen & Events",
    en: "Announcements & Events",
  },
  badges: {
    ua: ["Незабаром", "Заплановано", "Очікується"],
    de: ["Demnächst", "Geplant", "In Kürze"],
    en: ["Coming Soon", "Scheduled", "Coming Up"],
  },
  detailsBtn: {
    ua: "Детальніше",
    de: "Details",
    en: "Details",
  },
};

const BADGE_STYLES = [
  {
    className: "bg-green-700/95",
    Icon: Sparkles,
  },
  {
    className: "bg-blue-600/95",
    Icon: CalendarDays,
  },
  {
    className: "bg-slate-600/95",
    Icon: Clock,
  },
] as const;

export const EventsSection = () => {
  const { i18n } = useTranslation();

  const currentLang = getCurrentLanguage(
    i18n.resolvedLanguage || i18n.language,
  );

  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
        const eventsData = await fetchEvents();

        const upcomingEvents = (eventsData ?? [])
          .filter((event) => {
            const eventDate = new Date(event.date);
            return (
              !Number.isNaN(eventDate.getTime()) &&
              eventDate.getTime() >= today.getTime()
            );
          })
          .sort(
            (first, second) =>
              new Date(first.date).getTime() -
              new Date(second.date).getTime(),
          );

        setEventsList(upcomingEvents.slice(0, 3));
      } catch (error) {
        console.error("Помилка завантаження подій:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString(DATE_LOCALES[currentLang], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <PageLoader visible fullscreen={false} />;
  if (eventsList.length === 0) return null;

  return (
    <section className="font-nunito w-full md:p-4">
      <div className="mb-12 flex items-center justify-between text-center">
        <h2 className="text-preset-2 font-nunito w-full text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
          {TEXTS.sectionTitle[currentLang]}
        </h2>
      </div>

      <ul className="grid w-full grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-7 xl:grid-cols-3 xl:gap-10">
        {eventsList.map((event, index) => {
          const title =
            event.titles[currentLang]?.trim() ||
            event.titles.ua;

          const description =
            event.descriptions[currentLang]?.trim() ||
            event.descriptions.ua;

          const badge = BADGE_STYLES[index];
          const BadgeIcon = badge.Icon;
          const badgeText = TEXTS.badges[currentLang][index];

          return (
            <li
              key={event.id}
              className="group relative flex h-full w-full flex-col overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)]"
            >
              {/* Фото */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={event.imageBanner}
                  alt={title}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={
                    index === 0 ? "high" : "auto"
                  }
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Градієнт */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent"
                />

                {/* Компактний статус праворуч */}
                <div
                  className={`absolute top-4 right-4 z-10 inline-flex max-w-[calc(100%-2rem)] items-center gap-1.5 rounded-lg border border-white/25 px-2.5 py-1.5 text-xs leading-tight font-bold text-white shadow-md backdrop-blur-md ${badge.className}`}
                >
                  <BadgeIcon
                    size={14}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  <span>{badgeText}</span>
                </div>

                {/* Дата ліворуч унизу */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl border border-white/30 bg-black/45 px-3 py-2 text-sm font-bold text-white shadow-sm backdrop-blur-md">
                  <Calendar
                    size={15}
                    aria-hidden="true"
                  />
                  <time dateTime={event.date}>
                    {formatDate(event.date)}
                  </time>
                </div>
              </div>

              {/* Контент */}
              <div className="flex grow flex-col p-5 md:p-6">
                <h3 className="mb-3 text-2xl leading-tight font-bold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                  {title}
                </h3>

                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-gray-600">
                  {event.time && (
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Clock
                        size={16}
                        className="shrink-0 text-blue-600"
                        aria-hidden="true"
                      />
                      <span>{event.time}</span>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex min-w-0 items-center gap-1.5">
                      <MapPin
                        size={16}
                        className="shrink-0 text-red-600"
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {event.location}
                      </span>
                    </div>
                  )}
                </div>

                {description && (
                  <p className="mb-5 line-clamp-4 min-h-20 text-sm leading-5 text-gray-600">
                    {description}
                  </p>
                )}

                {/* Кнопка */}
                <Link
                  to={`/events/${event.id}`}
                  aria-label={`${TEXTS.detailsBtn[currentLang]}: ${title}`}
                  className="group/btn mt-auto flex items-center justify-center gap-3 rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-lg active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <span className="tracking-wider uppercase">
                    {TEXTS.detailsBtn[currentLang]}
                  </span>

                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
