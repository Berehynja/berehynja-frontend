import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";

import { PageLoader } from "../../ui/PageLoader";
import { optimizeCloudinaryImage } from "../../../services/cloudinaryService";
import { fetchEvents } from "../../../services/eventsService";
import type { Event } from "../../../types/event";
import type { LangKey } from "../../../types/types";

const getEventImageUrl = (url: string, width: number, height: number) =>
  optimizeCloudinaryImage(
    url,
    `f_auto,q_auto:good,c_fill,g_auto,w_${width},h_${height}`,
  );

export const EventsSection = () => {
  const { i18n } = useTranslation();
  const currentLang = (
    i18n.resolvedLanguage || i18n.language
  ).split("-")[0] as LangKey;

  const dateLocale =
    currentLang === "ua"
      ? "uk-UA"
      : currentLang === "de"
        ? "de-DE"
        : "en-US";

  const texts = {
    sectionTitle: {
      ua: "Анонси та події",
      de: "Ankündigungen & Events",
      en: "Announcements & Events",
    },
    upcomingBadge: {
      ua: "Найближча подія",
      de: "Nächste Veranstaltung",
      en: "Upcoming Event",
    },
    soonBadge: {
      ua: "Незабаром",
      de: "Demnächst",
      en: "Soon",
    },
    futureBadge: {
      ua: "Майбутня подія",
      de: "Kommendes Event",
      en: "Future Event",
    },
    detailsBtn: {
      ua: "Детальніше",
      de: "Details",
      en: "Details",
    },
  };

  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
        const eventsData = await fetchEvents();

        if (eventsData?.length > 0) {
          const upcomingEvents = eventsData
            .filter(
              (event) =>
                new Date(event.date).getTime() >= today.getTime(),
            )
            .sort(
              (firstEvent, secondEvent) =>
                new Date(firstEvent.date).getTime() -
                new Date(secondEvent.date).getTime(),
            );

          setEventsList(upcomingEvents.slice(0, 3));
        }
      } catch (error) {
        console.error("Помилка завантаження подій:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  if (loading) return <PageLoader visible />;
  if (eventsList.length === 0) return null;

  return (
    <section className="font-nunito w-full md:p-4">
      <div className="mb-12 flex items-center justify-between text-center">
        <h2 className="text-preset-2 font-nunito w-full text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
          {texts.sectionTitle[currentLang]}
        </h2>
      </div>

      <div className="font-nunito grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {eventsList.map((event, index) => {
          let badgeText = texts.futureBadge[currentLang];

          if (index === 0) {
            badgeText = texts.upcomingBadge[currentLang];
          } else if (index === 1) {
            badgeText = texts.soonBadge[currentLang];
          }

          return (
            <article
              key={event.id}
              className="group relative flex w-full flex-col overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.16)]"
            >
              <div className="relative h-64 shrink-0 overflow-hidden">
                <img
                  src={getEventImageUrl(event.imageBanner, 640, 320)}
                  srcSet={`${getEventImageUrl(event.imageBanner, 640, 320)} 640w, ${getEventImageUrl(event.imageBanner, 1024, 512)} 1024w`}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  alt={event.titles[currentLang]}
                  width={1024}
                  height={512}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-4 left-4 flex flex-col items-start gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-2.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-sm">
                    {badgeText}
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
                    <CalendarDays size={14} aria-hidden="true" />
                    {new Date(event.date).toLocaleDateString(dateLocale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex grow flex-col p-6">
                <h3 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-700">
                  {event.titles[currentLang]}
                </h3>

                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Clock
                      size={16}
                      aria-hidden="true"
                      className="text-blue-700"
                    />
                    {event.time}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin
                      size={16}
                      aria-hidden="true"
                      className="text-red-700"
                    />
                    <span className="max-w-37.5 truncate">
                      {event.location}
                    </span>
                  </div>
                </div>

                <div className="relative mb-6">
                  <p className="min-h-22 line-clamp-4 text-sm text-gray-600">
                    {event.descriptions[currentLang]}
                  </p>
                </div>

                <Link
                  to={`/events/${event.id}`}
                  className="group/btn mt-auto flex items-center justify-center gap-3 rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-blue-700 active:scale-95"
                >
                  <span className="inline-flex items-center text-sm font-bold tracking-wider text-white uppercase">
                    {texts.detailsBtn[currentLang]}
                  </span>

                  <span className="sr-only">
                    : {event.titles[currentLang]}
                  </span>

                  <ArrowRight
                    size={17}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
