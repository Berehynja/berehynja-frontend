import { Pencil, Calendar, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider/useAuth";

import type { Event } from "../../types/event";
import { useTranslation } from "react-i18next";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
}

export const EventCard = ({ event, onEdit }: EventCardProps) => {
  const { isAdmin } = useAuth();
  const { i18n } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString(i18n.language === "ua" ? "uk" : i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <li className="group relative flex w-full flex-col overflow-hidden rounded-4xl border border-gray-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
      {/* КНОПКА РЕДАГУВАННЯ - тепер більш інтегрована */}
      {isAdmin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onEdit(event);
          }}
          className="absolute top-4 right-4 z-20 cursor-pointer rounded-full border border-white/50 bg-white/80 p-2.5 text-gray-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-blue-600 hover:text-white"
        >
          <Pencil size={18} />
        </button>
      )}

      
        {/* КОНТЕЙНЕР ЗОБРАЖЕННЯ */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={event.imageBanner}
            alt={event.titles[i18n.language as keyof typeof event.titles]}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Градієнт поверх фото для глибини */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-60" />

          {/* Бейдж з датою поверх фото */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl border border-white/30 bg-black/40 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
            <Calendar size={14} />
            {formatDate(event.date)}
          </div>
        </div>

        {/* КОНТЕНТ */}
        <div className="flex grow flex-col p-6">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
            {event.titles[i18n.language as keyof typeof event.titles]}
          </h2>

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

          {/* БЛОК ОПИСУ: 4 рядки та градієнтне затухання */}
          <div className="relative ">
            <p className="min-h-21.5 line-clamp-4 text-sm mb-4 text-gray-500">{event.descriptions[i18n.language as keyof typeof event.descriptions]}</p>
          </div>

          {/* КНОПКА "ЧИТАТИ БІЛЬШЕ" — як у попередньому варіанті */}
          <Link to={`/events/${event.id}`}  className=" group/btn flex items-center justify-center gap-3 rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:shadow-lg active:scale-95"
>
            <div className=" inline-flex items-center text-sm font-bold tracking-wider text-white uppercase ">
              Детальніше
              <span className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
            </div>
          </Link>
        </div>
      
    </li>
  );
};
