import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider/useAuth";
// import { ImageCarousel } from "../imageCarousel/imageCarousel";
import type { Event } from "../../types/event";
import { useTranslation } from 'react-i18next';
// import { AddEventModal } from "../Modals/AddEventModal";

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
      month: "long",
      day: "numeric",
    });
  };

  // const items = [...(event.images || []), ...(event.videos || [])];
  return (
    <>
      <li
        key={event.id}
        className="relative w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg"
      >
        <Link to={`/events/${event.id}`} className="block">
          <div className="p-3">
            <h2 className="mb-2 text-xl font-bold">{event.title}</h2>
            <p className="text-gray-600">
              {formatDate(event.date)} {event.time}
            </p>
          </div>
          <div className="relative h-90 overflow-hidden p-2">
            <img
              src={event.imageBanner}
              alt={event.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </Link>

        {/* {items.length > 0 && <ImageCarousel items={items} />} */}

        <p className="text-md mt-2 px-3 text-gray-500">{event.location}</p>
        <p className="min-h-30 p-3 text-gray-700">{event.description}</p>

        {/* КНОПКА РЕДАГУВАННЯ */}
        {isAdmin && (
          <button
            onClick={() => onEdit(event)}
            className="absolute top-3.5 right-3.5 cursor-pointer rounded-full p-3 text-black/60 outline-1 outline-black/60 transition-all duration-300 hover:text-gray-300 hover:outline-gray-300/70"
          >
            <Pencil size={24} />
          </button>
        )}
      </li>
    </>
  );
};
