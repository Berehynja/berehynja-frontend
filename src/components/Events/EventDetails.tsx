import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Clock3,
  ImageIcon,
  MapPin,
  Play,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { db } from "../../firebase";
import { getEventById } from "../../services/eventsService";
import type { Event } from "../../types/event";
import type { LangKey } from "../../types/types";
import { useAuth } from "../AuthProvider/useAuth";
import { AddMediaModal } from "../Modals/AddMediaModal";
import { PageLoader } from "../ui/PageLoader";

interface MediaItem {
  id: string;
  url: string;
  alt: string;
  type: "image" | "video";
}

type MediaCategory = "images" | "videos";

const EVENT_DETAILS_TEXT = {
  back: {
    ua: "Повернутися до списку",
    de: "Zurück zur Übersicht",
    en: "Back to events",
  },
  photos: {
    ua: "Фотографії",
    de: "Fotos",
    en: "Photos",
  },
  videos: {
    ua: "Відео",
    de: "Videos",
    en: "Videos",
  },
  addPhoto: {
    ua: "Додати фото",
    de: "Foto hinzufügen",
    en: "Add photo",
  },
  addVideo: {
    ua: "Додати YouTube-відео",
    de: "YouTube-Video hinzufügen",
    en: "Add YouTube video",
  },
  deletePhoto: {
    ua: "Видалити фотографію",
    de: "Foto löschen",
    en: "Delete photo",
  },
  deleteVideo: {
    ua: "Видалити відео",
    de: "Video löschen",
    en: "Delete video",
  },
  confirmDelete: {
    ua: "Видалити цей файл?",
    de: "Diese Datei löschen?",
    en: "Delete this file?",
  },
  noPhotos: {
    ua: "Фотографії цієї події ще не додані.",
    de: "Für diese Veranstaltung wurden noch keine Fotos hinzugefügt.",
    en: "No photos have been added to this event yet.",
  },
  noVideos: {
    ua: "Відео цієї події ще не додані.",
    de: "Für diese Veranstaltung wurden noch keine Videos hinzugefügt.",
    en: "No videos have been added to this event yet.",
  },
  notFound: {
    ua: "Подію не знайдено.",
    de: "Veranstaltung nicht gefunden.",
    en: "Event not found.",
  },
  openPhoto: {
    ua: "Відкрити фотографію",
    de: "Foto öffnen",
    en: "Open photo",
  },
  playVideo: {
    ua: "Відтворити відео",
    de: "Video abspielen",
    en: "Play video",
  },
  showMore: {
    ua: "Показати більше",
    de: "Mehr anzeigen",
    en: "Show more",
  },
  showLess: {
    ua: "Згорнути",
    de: "Weniger anzeigen",
    en: "Show less",
  },
  close: {
    ua: "Закрити",
    de: "Schließen",
    en: "Close",
  },
};

const DATE_LOCALES: Record<LangKey, string> = {
  ua: "uk-UA",
  de: "de-DE",
  en: "en-US",
};

const getYouTubeId = (url: string) => {
  const match = url.match(
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
  );

  return match?.[1]?.length === 11 ? match[1] : null;
};

const getOptimizedImageUrl = (url: string) => {
  if (!url.includes("cloudinary.com") || !url.includes("/upload/")) return url;

  return url.replace(
    "/upload/",
    "/upload/w_800,h_800,c_fill,g_auto,f_auto,q_auto:good/",
  );
};

export const EventDetails = () => {
  const { eventId } = useParams();
  const { i18n } = useTranslation();
  const { isAdmin } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [activeCategory, setActiveCategory] = useState<MediaCategory>("images");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language).split(
    "-",
  )[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        setIsLoading(false);
        return;
      }

      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (error) {
        console.error("Event loading error:", error);
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (!selectedMedia) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") setSelectedMedia(null);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMedia]);

  const title = event?.titles[currentLang] || event?.titles.ua || "";
  const description =
    event?.descriptions[currentLang] || event?.descriptions.ua || "";
  const shouldCollapseDescription = description.length > 320;

  const formattedDate = event?.date
    ? new Date(event.date).toLocaleDateString(DATE_LOCALES[currentLang], {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const handleOpenUpload = (type: "image" | "video") => {
    setMediaType(type);
    setIsModalOpen(true);
  };

  const handleAddMedia = async (url: string) => {
    if (!eventId || !event) return;

    const category: MediaCategory = mediaType === "image" ? "images" : "videos";
    const eventRef = doc(db, "events", eventId);
    const newItem: MediaItem = {
      id: doc(collection(db, "temp")).id,
      url,
      type: mediaType,
      alt: title || "Event media",
    };

    await updateDoc(eventRef, { [category]: arrayUnion(newItem) });

    setEvent((currentEvent) => {
      if (!currentEvent) return null;

      return {
        ...currentEvent,
        [category]: [...(currentEvent[category] || []), newItem],
      };
    });

    setActiveCategory(category);
  };

  const handleDeleteMedia = async (
    item: MediaItem,
    category: MediaCategory,
  ) => {
    if (
      !eventId ||
      !window.confirm(EVENT_DETAILS_TEXT.confirmDelete[currentLang])
    ) {
      return;
    }

    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, { [category]: arrayRemove(item) });

      setEvent((currentEvent) => {
        if (!currentEvent) return null;

        return {
          ...currentEvent,
          [category]: currentEvent[category]?.filter(
            (mediaItem) => mediaItem.id !== item.id,
          ),
        };
      });
    } catch (error) {
      console.error("Media deletion error:", error);
    }
  };

  if (isLoading) return <PageLoader visible />;

  if (!event) {
    return (
      <div className="flex min-h-80 w-full flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="text-xl font-bold text-slate-700">
          {EVENT_DETAILS_TEXT.notFound[currentLang]}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition-colors hover:bg-blue-700"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          {EVENT_DETAILS_TEXT.back[currentLang]}
        </Link>
      </div>
    );
  }

  const photos = event.images || [];
  const videos = event.videos || [];

  return (
    <div className="w-full px-3 py-8 md:px-4">
      <div className="mx-auto w-full max-w-7xl">
        <Link
          to="/events"
          className="mb-8 inline-flex items-center gap-2 rounded-xl px-1 py-2 font-bold text-blue-600 transition-colors hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          {EVENT_DETAILS_TEXT.back[currentLang]}
        </Link>

        <article className="mb-10 grid grid-cols-1 overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.1)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="relative aspect-video min-h-56 overflow-hidden bg-slate-100 md:aspect-auto md:min-h-90">
            {event.imageBanner ? (
              <img
                src={event.imageBanner}
                alt={title}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <ImageIcon size={54} aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col justify-center p-5 md:p-7 lg:p-8">
            <h1 className="font-nunito text-3xl leading-tight font-black text-slate-950 md:text-4xl">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2.5 text-sm font-bold">
              {formattedDate && (
                <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-blue-700">
                  <CalendarDays size={17} aria-hidden="true" />
                  <time dateTime={event.date}>{formattedDate}</time>
                </div>
              )}

              {event.time && (
                <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-700">
                  <Clock3 size={17} aria-hidden="true" />
                  {event.time}
                </div>
              )}

              {event.location && (
                <div className="flex min-w-0 items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-800">
                  <MapPin size={17} className="shrink-0" aria-hidden="true" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
            </div>

            {description && (
              <div className="mt-5">
                <p
                  className={`wrap-break-word whitespace-pre-wrap text-base leading-7 text-slate-700 ${
                    isDescriptionExpanded || !shouldCollapseDescription
                      ? ""
                      : "line-clamp-5"
                  }`}
                >
                  {description}
                </p>

                {shouldCollapseDescription && (
                  <button
                    type="button"
                    onClick={() =>
                      setIsDescriptionExpanded((isExpanded) => !isExpanded)
                    }
                    className="mt-3 cursor-pointer font-bold text-blue-600 transition-colors hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {isDescriptionExpanded
                      ? EVENT_DETAILS_TEXT.showLess[currentLang]
                      : EVENT_DETAILS_TEXT.showMore[currentLang]}
                  </button>
                )}
              </div>
            )}
          </div>
        </article>

        <section aria-label={EVENT_DETAILS_TEXT.photos[currentLang]}>
          <div className="mb-8 flex justify-center">
            <div
              role="tablist"
              aria-label={EVENT_DETAILS_TEXT.photos[currentLang]}
              className="grid w-full max-w-xl grid-cols-2 rounded-2xl border border-slate-200 bg-slate-100 p-1.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "images"}
                aria-controls="event-photos-panel"
                onClick={() => setActiveCategory("images")}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold transition-all ${
                  activeCategory === "images"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <Camera size={19} aria-hidden="true" />
                {EVENT_DETAILS_TEXT.photos[currentLang]}
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                  {photos.length}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "videos"}
                aria-controls="event-videos-panel"
                onClick={() => setActiveCategory("videos")}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold transition-all ${
                  activeCategory === "videos"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <Video size={19} aria-hidden="true" />
                {EVENT_DETAILS_TEXT.videos[currentLang]}
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                  {videos.length}
                </span>
              </button>
            </div>
          </div>

          {activeCategory === "images" && (
            <div id="event-photos-panel" role="tabpanel">
              {photos.length > 0 || isAdmin ? (
                <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {isAdmin && (
                    <li className="aspect-square">
                      <button
                        type="button"
                        onClick={() => handleOpenUpload("image")}
                        className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-6 text-center text-blue-600 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-50 hover:shadow-[0_14px_35px_rgba(37,99,235,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                          <Plus
                            size={36}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </span>
                        <span className="font-bold">
                          {EVENT_DETAILS_TEXT.addPhoto[currentLang]}
                        </span>
                      </button>
                    </li>
                  )}

                  {photos.map((image) => (
                    <li
                      key={image.id}
                      className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.1)]"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedMedia(image)}
                        aria-label={`${EVENT_DETAILS_TEXT.openPhoto[currentLang]}: ${image.alt || title}`}
                        className="h-full w-full cursor-zoom-in"
                      >
                        <img
                          src={getOptimizedImageUrl(image.url)}
                          alt={image.alt || title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() =>
                            void handleDeleteMedia(image, "images")
                          }
                          aria-label={`${EVENT_DETAILS_TEXT.deletePhoto[currentLang]}: ${image.alt || title}`}
                          title={EVENT_DETAILS_TEXT.deletePhoto[currentLang]}
                          className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/40 bg-red-600 text-white shadow-lg transition-all hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-slate-500">
                  <Camera size={34} className="mb-4" aria-hidden="true" />
                  <p>{EVENT_DETAILS_TEXT.noPhotos[currentLang]}</p>
                </div>
              )}
            </div>
          )}

          {activeCategory === "videos" && (
            <div id="event-videos-panel" role="tabpanel">
              {videos.length > 0 || isAdmin ? (
                <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {isAdmin && (
                    <li className="aspect-video">
                      <button
                        type="button"
                        onClick={() => handleOpenUpload("video")}
                        className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/60 p-6 text-center text-purple-700 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:bg-purple-50 hover:shadow-[0_14px_35px_rgba(147,51,234,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                      >
                        <span className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                          <Plus
                            size={32}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </span>
                        <span className="font-bold">
                          {EVENT_DETAILS_TEXT.addVideo[currentLang]}
                        </span>
                      </button>
                    </li>
                  )}

                  {videos.map((video) => {
                    const videoId = getYouTubeId(video.url);

                    return (
                      <li
                        key={video.id}
                        className="group relative aspect-video overflow-hidden rounded-2xl bg-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
                      >
                        {videoId && (
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                            alt={video.alt || title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover opacity-75 transition-all duration-500 group-hover:scale-105 group-hover:opacity-55"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedMedia(video)}
                          disabled={!videoId}
                          aria-label={`${EVENT_DETAILS_TEXT.playVideo[currentLang]}: ${video.alt || title}`}
                          className="absolute inset-0 flex cursor-pointer items-center justify-center disabled:cursor-not-allowed"
                        >
                          <span className="flex size-16 items-center justify-center rounded-full border border-white/50 bg-white/20 text-white shadow-xl backdrop-blur-md transition-transform group-hover:scale-110">
                            <Play
                              size={28}
                              className="ml-1 fill-current"
                              aria-hidden="true"
                            />
                          </span>
                        </button>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() =>
                              void handleDeleteMedia(video, "videos")
                            }
                            aria-label={`${EVENT_DETAILS_TEXT.deleteVideo[currentLang]}: ${video.alt || title}`}
                            title={EVENT_DETAILS_TEXT.deleteVideo[currentLang]}
                            className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/40 bg-red-600 text-white shadow-lg transition-all hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                          >
                            <Trash2 size={18} aria-hidden="true" />
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-slate-500">
                  <Video size={34} className="mb-4" aria-hidden="true" />
                  <p>{EVENT_DETAILS_TEXT.noVideos[currentLang]}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {selectedMedia && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={
            selectedMedia.type === "video"
              ? EVENT_DETAILS_TEXT.videos[currentLang]
              : EVENT_DETAILS_TEXT.photos[currentLang]
          }
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative flex w-full max-w-6xl items-center justify-center pt-12"
            onClick={(mouseEvent) => mouseEvent.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              aria-label={EVENT_DETAILS_TEXT.close[currentLang]}
              title={EVENT_DETAILS_TEXT.close[currentLang]}
              className="absolute top-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <X size={24} aria-hidden="true" />
            </button>

            {selectedMedia.type === "video" ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(selectedMedia.url)}?autoplay=1&rel=0`}
                  title={selectedMedia.alt || title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.alt || title}
                className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
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
        title={title || "Event media"}
        subFolder={title || "general"}
      />
    </div>
  );
};
