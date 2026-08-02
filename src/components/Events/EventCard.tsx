import { Calendar, Clock, MapPin, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useAuth } from "../AuthProvider/useAuth";
import type { Event } from "../../types/event";
import type { LangKey } from "../../types/types";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  priority?: boolean;
}

const EVENT_CARD_TEXT = {
  details: {
    ua: "Детальніше",
    de: "Mehr erfahren",
    en: "Learn more",
  },
  edit: {
    ua: "Редагувати подію",
    de: "Veranstaltung bearbeiten",
    en: "Edit event",
  },
};

const DATE_LOCALES: Record<LangKey, string> = {
  ua: "uk-UA",
  de: "de-DE",
  en: "en-US",
};

export const EventCard = ({
  event,
  onEdit,
  priority = false,
}: EventCardProps) => {
  const { isAdmin } = useAuth();
  const { i18n } = useTranslation();

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language).split(
    "-",
  )[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  const title = event.titles[currentLang] || event.titles.ua;
  const description = event.descriptions[currentLang] || event.descriptions.ua;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString(DATE_LOCALES[currentLang], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <li className="group relative flex h-full w-full flex-col overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)]">
      {isAdmin && (
        <button
          type="button"
          onClick={() => onEdit(event)}
          aria-label={`${EVENT_CARD_TEXT.edit[currentLang]}: ${title}`}
          title={EVENT_CARD_TEXT.edit[currentLang]}
          className="absolute top-4 right-4 z-20 flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/60 bg-white/90 text-gray-700 shadow-md backdrop-blur-md transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Pencil size={18} aria-hidden="true" />
        </button>
      )}

      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={event.imageBanner}
          alt={title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent"
        />

        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl border border-white/30 bg-black/45 px-3 py-2 text-sm font-bold text-white shadow-sm backdrop-blur-md">
          <Calendar size={15} aria-hidden="true" />
          <time dateTime={event.date}>{formatDate(event.date)}</time>
        </div>
      </div>

      <div className="flex grow flex-col p-5 md:p-6">
        <h2 className="mb-3 text-2xl leading-tight font-bold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
          {title}
        </h2>

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
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {description && (
          <p className="mb-5 line-clamp-4 min-h-20 text-sm leading-5 text-gray-600">
            {description}
          </p>
        )}

        <Link
          to={`/events/${event.id}`}
          aria-label={`${EVENT_CARD_TEXT.details[currentLang]}: ${title}`}
          className="group/btn mt-auto flex items-center justify-center gap-3 rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-lg active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="tracking-wider uppercase">
            {EVENT_CARD_TEXT.details[currentLang]}
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
};
