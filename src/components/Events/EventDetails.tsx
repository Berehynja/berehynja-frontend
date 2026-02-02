import { db } from "../../firebase";
import { doc, collection, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEventById } from "../../services/eventsService";
import { useTranslation } from "react-i18next";
import { useAuth } from "../AuthProvider/useAuth";

import type { Event } from "../../types/event";
import { AddMediaModal } from "../Modals/AddMediaModal";

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

  const [event, setEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  // Змінено: тепер стан зберігає або рядок (для відео), або весь об'єкт MediaItem (для фото)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | string | null>(null);

  useEffect(() => {
    const getSingleEvent = async () => {
      if (!eventId) return;
      const eventData = await getEventById(eventId);
      setEvent(eventData as Event);
    };

    getSingleEvent();
  }, [eventId]);

  // Блокуємо скрол сторінки, коли відкрита модалка
  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Обов'язково "чистимо" стилі при виході з компонента
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedMedia]);

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getOptimizedUrl = (url: string) => {
    if (!url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_600,h_600,c_fill,g_auto,f_auto,q_auto/");
  };

  const handleAddMedia = async (url: string) => {
    if (!eventId || !event) return;

    const category = mediaType === "image" ? "images" : "videos";

    const eventRef = doc(db, "events", eventId);
    const autoId = doc(collection(db, "temp")).id;

    const newItem = {
      id: autoId,
      url: url,
      type: mediaType,
      alt: event.title || "media content",
    };

    await updateDoc(eventRef, { [category]: arrayUnion(newItem) });
    setEvent((prev) => {
      if (!prev) return null;
      return { ...prev, [category]: [...(prev[category] || []), newItem] };
    });
  };

  const handleDeleteMedia = async (item: MediaItem, category: "images" | "videos") => {
    if (!eventId) return;
    if (!window.confirm("Видалити цей файл?")) return;

    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, { [category]: arrayRemove(item) });

    setEvent((prev) => {
      if (!prev) return null;
      return { ...prev, [category]: prev[category]?.filter((i) => i.id !== item.id) };
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      
      <div className="mb-10 flex flex-col gap-8 md:flex-row">
        <div className="w-full overflow-hidden rounded-xl bg-gray-100 shadow-md md:w-1/2">
          {event?.imageBanner && (
            <img
              src={event.imageBanner}
              alt="banner"
              className="h-full min-h-[300px] w-full object-cover"
            />
          )}
        </div>
        <div className="flex w-full flex-col justify-center md:w-1/2">
          <h2 className="font-montserratBold mb-3 text-3xl text-gray-900">{event?.title}</h2>
          <p className="mb-2 font-semibold text-blue-600">
            {event?.date &&
              new Date(event.date).toLocaleDateString(i18n.language === "ua" ? "uk-UA" : "en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
          </p>
          <p className="font-montserratItalic mb-4 text-gray-600">
            {event?.time} | {event?.location}
          </p>
          <p className="font-montserratBold text-lg leading-relaxed text-gray-800">
            {event?.description}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="mb-8 flex flex-wrap gap-4 border-b border-gray-200 pb-6">
          <button
            onClick={() => {
              setMediaType("image");
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            + Додати Фото
          </button>
          <button
            onClick={() => {
              setMediaType("video");
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-purple-600 px-6 py-2.5 font-medium text-white transition hover:bg-purple-700"
          >
            + Додати YouTube Відео
          </button>
        </div>
      )}

      {/* Сітка медіа-файлів */}
      <div className="w-full">
        <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* ФОТОГРАФІЇ */}
          {event?.images?.map((img) => (
            <li
              key={img.id}
              onClick={() => setSelectedMedia(img)} // Нове: відкриття фото в модалці
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-100 shadow-sm transition hover:shadow-md"
            >
              <img
                src={getOptimizedUrl(img.url)}
                alt={img.alt}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMedia(img, "images");
                  }} // Зупиняємо всплиття, щоб не відкрилась модалка
                  className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-2 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </li>
          ))}

          {/* ВІДЕО */}
          {event?.videos?.map((vid) => {
            const videoId = getYouTubeID(vid.url);
            return (
              <li
                key={vid.id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-black shadow-sm"
              >
                <img
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                  className="h-full w-full object-cover opacity-70 transition duration-300 group-hover:opacity-50"
                  alt="YouTube Preview"
                />
                <button
                  onClick={() => setSelectedMedia(vid.url)} // Відкриваємо відео
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-sm transition hover:scale-110 hover:bg-white/30">
                    <div className="ml-1 border-y-10 border-l-16 border-y-transparent border-l-white"></div>
                  </div>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteMedia(vid, "videos")}
                    className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-2 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                  >
                    ✕
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* УНІВЕРСАЛЬНА МОДАЛКА (ДЛЯ ФОТО ТА ВІДЕО) */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative flex w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-3xl text-white transition hover:text-gray-300"
              onClick={() => setSelectedMedia(null)}
            >
              &times;
            </button>

            {typeof selectedMedia === "string" ? (
              // Якщо рядок — показуємо відео YouTube
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${getYouTubeID(selectedMedia)}?autoplay=1&rel=0`}
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              // Якщо об'єкт — показуємо велике фото
              <img
                src={selectedMedia.url}
                alt={selectedMedia.alt}
                className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
            )}
          </div>
        </div>
      )}

      <AddMediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleAddMedia}
        type={mediaType}
        title={event?.title || "media"}
        subFolder={event?.title || "general"}
      />
    </div>
  );

};
