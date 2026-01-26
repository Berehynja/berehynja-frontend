import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider/useAuth";
import { ImageCarousel } from "../icons/imageCarousel/imageCarousel";


interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    imageBanner?: string;
    images?: { id: string; url: string; type: string; alt: string }[];
    videos?: { id: string; url: string; type: string; alt: string }[];
    description?: string;
  };
}


export const EventCard = ({ event }: EventCardProps) => {
  const { isAdmin } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const items = [
    ...(event.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      type: "image" as const,
      alt: img.alt,
    })),
    ...(event.videos || []).map((vid) => ({
      id: vid.id,
      url: vid.url,
      type: "video" as const,
      alt: vid.alt,
    })),
  ];
  return (
    <>
      <li
        key={event.id}
        className="relative w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg"
      >
        <Link to={`/events/${event.id}`} className="block">
          <div className="p-3">
            <h2 className="mb-2 text-xl font-bold">{event.title}</h2>
            <p className="text-gray-600">{formatDate(event.date)}</p>
          </div>
          <div className="relative h-90 overflow-hidden p-2">
            <img
              src={event.imageBanner}
              alt={event.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </Link>
        {items.length > 0 && <ImageCarousel items={items} />}
        <p className="min-h-30 p-4 text-gray-700">{event.description}</p>

        {/* КНОПКА РЕДАГУВАННЯ */}
        {isAdmin && (
          <button
            
            className="absolute top-3.5 right-3.5 cursor-pointer rounded-full p-3 text-black/60 outline-1 outline-black/60 transition-all duration-300 hover:text-gray-300 hover:outline-gray-300/70"
          >
            <Pencil size={24} />
          </button>
        )}
      </li>
    </>
  );
};
