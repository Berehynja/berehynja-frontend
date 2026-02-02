import { Pencil, Calendar, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider/useAuth";

import type { Event } from "../../types/event";
import { useTranslation } from 'react-i18next';


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
    <li className="group relative flex flex-col w-full overflow-hidden rounded-4xl bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100">
      
      {/* КНОПКА РЕДАГУВАННЯ - тепер більш інтегрована */}
      {isAdmin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onEdit(event);
          }}
          className="absolute top-4 right-4 z-20 cursor-pointer rounded-full bg-white/80 p-2.5 text-gray-700 backdrop-blur-md transition-all duration-300 hover:bg-blue-600 hover:text-white shadow-sm border border-white/50"
        >
          <Pencil size={18} />
        </button>
      )}

      <Link to={`/events/${event.id}`} className="flex flex-col h-full">
        {/* КОНТЕЙНЕР ЗОБРАЖЕННЯ */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={event.imageBanner}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Градієнт поверх фото для глибини */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-60" />
          
          {/* Бейдж з датою поверх фото */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-black/40 px-3 py-1.5 text-white backdrop-blur-md border border-white/30 text-sm font-medium">
            <Calendar size={14} />
            {formatDate(event.date)}
          </div>
        </div>

       {/* КОНТЕНТ */}
<div className="flex flex-col grow p-6">
  <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
    {event.title}
  </h2>

  {/* Інфо-панель */}
  <div className="mb-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-gray-500">
    <div className="flex items-center gap-1.5">
      <Clock size={16} className="text-blue-500" />
      {event.time}
    </div>
    <div className="flex items-center gap-1.5">
      <MapPin size={16} className="text-red-500" />
      <span className="truncate max-w-[150px]">{event.location}</span>
    </div>
  </div>

  {/* БЛОК ОПИСУ: 4 рядки та градієнтне затухання */}
  <div className="relative mb-4"> 
    <p className=" min-h-23 text-gray-600  text-sm overflow-hidden">
      {event.description}
    </p>
    
    {/* Градієнтне затухання (туман) */}
    <div className="absolute bottom-0 left-0 h-8 w-full bg-linear-to-t from-white via-white/90 to-transparent pointer-events-none" />
  </div>

  {/* КНОПКА "ЧИТАТИ БІЛЬШЕ" — як у попередньому варіанті */}
  <div className="mt-auto pt-2">
    <div
      
      className="group/btn inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-all uppercase tracking-wider"
    >
      Читати більше
      <span className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1">
        →
      </span>
    </div>
  </div>
</div>
      </Link>
    </li>
  );
};
