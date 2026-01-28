import { db } from "../../firebase";
import { doc, collection, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEventById } from "../../services/eventsService";
import { useTranslation } from "react-i18next";
import { useAuth } from "../AuthProvider/useAuth";
// import { AddEvent } from "../Buttons/AddEvent";
import type { Event } from "../../types/event";
import { AddMediaModal } from "../Modals/AddMediaModal"; // Создай этот компонент (код ниже)


interface MediaItem {
  id: string;
  url: string;
  alt: string;
  type: "image" | "video";
}

export const EventDetails = () => {
  const { eventId } = useParams();
  const { i18n } = useTranslation();
  const { isAdmin } = useAuth();
  
  // Типизируем стейт как Event, чтобы иметь доступ к images и videos
  const [event, setEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  useEffect(() => {
    const getSingleEvent = async () => {
      if (!eventId) return;
      const eventData = await getEventById(eventId);
      setEvent(eventData as Event);
    };

    getSingleEvent();
  }, [eventId]);

  // Функция добавления медиа
  const handleAddMedia = async (url: string) => {
    if (!eventId || !event) return;

    const category = mediaType === "image" ? "images" : "videos";

    const eventRef = doc(db, "events", eventId);
    const autoId = doc(collection(db, "temp")).id;

    const newItem = {
      id: autoId,
      url: url,
      type: mediaType as "image" | "video",
      alt: event.title || "media content",
    };

    await updateDoc(eventRef, {
      [category]: arrayUnion(newItem),
    });

    // Обновляем локальный стейт, чтобы юзер сразу увидел результат
    setEvent((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [category]: [...(prev[category] || []), newItem],
      };
    });
  };

  // Функция удаления медиа
  const handleDeleteMedia = async (item: MediaItem, category: "images" | "videos") => {
    if (!eventId) return;
    if (!window.confirm("Видалити цей файл?")) return;

    const eventRef = doc(db, "events", eventId);
    
    await updateDoc(eventRef, {
      [category]: arrayRemove(item),
    });

    setEvent((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [category]: prev[category]?.filter((i) => i.id !== item.id),
      };
    });
  };

  return (
    <div className="w-full py-8">
      {/* Секция баннера и описания */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row">
        <div className="min-h-20 w-full overflow-hidden rounded-lg bg-gray-100 md:w-1/2">
          {event?.imageBanner && <img src={event.imageBanner} alt="banner" className="w-full object-cover" />}
        </div>
        <div className="flex w-full flex-col justify-center pl-6 md:w-1/2">
          <h2 className="font-montserratBold mb-2 text-xl">{event?.title}</h2>
          <p className="mb-4">
            {event?.date && new Date(event.date).toLocaleDateString(i18n.language === "ua" ? "uk-UA" : "en-US", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
          <p className="font-montserratItalic mb-4">{event?.time} | {event?.location}</p>
          <p className="font-montserratBold text-lg">{event?.description}</p>
        </div>
      </div>

      {/* Кнопки добавления для Админа */}
      {isAdmin && (
        <div className="mb-6 flex gap-4">
          <button 
            onClick={() => { setMediaType("image"); setIsModalOpen(true); }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <span>+ Додати Фото</span>
          </button>
          <button 
            onClick={() => { setMediaType("video"); setIsModalOpen(true); }}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            <span>+ Додати Відео</span>
          </button>
        </div>
      )}

      {/* Сетка медиа-файлов (Маппинг) */}
      <div className="w-full">
        <ul className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* ФОТО */}
          {event?.images?.map((img) => (
            <li key={img.id} className="group relative min-h-40 overflow-hidden rounded-lg bg-gray-100">
              <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
              {isAdmin && (
                <button 
                  onClick={() => handleDeleteMedia(img, "images")}
                  className="absolute top-2 right-2 hidden rounded-full bg-red-500 p-2 text-white group-hover:block"
                >
                  ✕
                </button>
              )}
            </li>
          ))}

          {/* ВИДЕО */}
          {event?.videos?.map((vid) => (
            <li key={vid.id} className="group relative min-h-40 overflow-hidden rounded-lg bg-black">
              <video src={vid.url} controls className="h-full w-full" />
              {isAdmin && (
                <button 
                  onClick={() => handleDeleteMedia(vid, "videos")}
                  className="absolute top-2 right-2 z-10 hidden rounded-full bg-red-500 p-2 text-white group-hover:block"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Модалка загрузки */}
      <AddMediaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleAddMedia}
        type={mediaType}
        title={mediaType === "image" ? "Додати Фото" : "Додати Відео"}
      />
    </div>
  );

};
