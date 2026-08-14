import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Clock3,
  ImageIcon,
  Loader2,
  MapPin,
  Play,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
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
  publicId?: string;
}

type MediaCategory = "images" | "videos";

const DATE_LOCALES: Record<LangKey, string> = {
  ua: "uk-UA",
  de: "de-DE",
  en: "en-GB",
};

const getCurrentLanguage = (language: string): LangKey => {
  const normalizedLanguage = language.split("-")[0].toLowerCase();

  return ["ua", "de", "en"].includes(normalizedLanguage)
    ? (normalizedLanguage as LangKey)
    : "ua";
};

const getYouTubeId = (value: string): string | null => {
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace("www.", "");

    if (hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id?.length === 11 ? id : null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const queryId = url.searchParams.get("v");
      if (queryId?.length === 11) return queryId;

      const pathParts = url.pathname.split("/").filter(Boolean);
      const supportedPrefix = ["embed", "shorts", "live"].includes(
        pathParts[0] ?? "",
      );
      const pathId = supportedPrefix ? pathParts[1] : null;

      return pathId?.length === 11 ? pathId : null;
    }
  } catch {
    const fallbackMatch = value.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
    );

    return fallbackMatch?.[1] ?? null;
  }

  return null;
};

const getCloudinaryUrl = (url: string, transformation: string) => {
  if (!url.includes("cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  return url.replace("/upload/", `/upload/${transformation}/`);
};

const formatEventDate = (dateValue: string, language: LangKey) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(DATE_LOCALES[language], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const EventDetails = () => {
  const { eventId } = useParams();
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBannerLoading, setIsBannerLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [activeCategory, setActiveCategory] =
    useState<MediaCategory>("images");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const currentLang = getCurrentLanguage(
    i18n.resolvedLanguage || i18n.language,
  );

  useEffect(() => {
    let isActive = true;

    const loadEvent = async () => {
      setIsLoading(true);
      setEvent(null);
      setSelectedMedia(null);
      setIsDescriptionExpanded(false);
      setActiveCategory("images");

      if (!eventId) {
        setIsLoading(false);
        return;
      }

      try {
        const eventData = await getEventById(eventId);

        if (!isActive) return;

        setEvent(eventData);
        setIsBannerLoading(Boolean(eventData?.imageBanner));
      } catch (error) {
        if (!isActive) return;

        console.error("Event loading error:", error);
        setEvent(null);
        toast.error(t("events.details.loadError"));
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadEvent();

    return () => {
      isActive = false;
    };
  }, [eventId, t]);

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
    ? formatEventDate(event.date, currentLang)
    : "";

  const handleOpenUpload = (type: "image" | "video") => {
    setMediaType(type);
    setIsModalOpen(true);
  };

  const handleAddMedia = async (url: string, publicId?: string) => {
    if (!eventId || !event) return;

    const category: MediaCategory = mediaType === "image" ? "images" : "videos";
    const newItem: MediaItem = {
      id: crypto.randomUUID(),
      url,
      type: mediaType,
      alt: title || t("events.details.eventMedia"),
      ...(publicId ? { publicId } : {}),
    };

    await updateDoc(doc(db, "events", eventId), {
      [category]: arrayUnion(newItem),
    });

    setEvent((currentEvent) => {
      if (!currentEvent) return null;

      return {
        ...currentEvent,
        [category]: [...(currentEvent[category] || []), newItem],
      };
    });

    setActiveCategory(category);
    toast.success(
      t(
        mediaType === "image"
          ? "events.details.photoAdded"
          : "events.details.videoAdded",
      ),
    );
  };

  const handleDeleteMedia = async (
    item: MediaItem,
    category: MediaCategory,
  ) => {
    if (
      !eventId ||
      deletingMediaId ||
      !window.confirm(t("events.details.confirmDelete"))
    ) {
      return;
    }

    setDeletingMediaId(item.id);

    try {
      await updateDoc(doc(db, "events", eventId), {
        [category]: arrayRemove(item),
      });

      setEvent((currentEvent) => {
        if (!currentEvent) return null;

        return {
          ...currentEvent,
          [category]: (currentEvent[category] || []).filter(
            (mediaItem) => mediaItem.id !== item.id,
          ),
        };
      });

      if (selectedMedia?.id === item.id) setSelectedMedia(null);
      toast.success(t("events.details.mediaDeleted"));
    } catch (error) {
      console.error("Media deletion error:", error);
      toast.error(t("events.details.deleteError"));
    } finally {
      setDeletingMediaId(null);
    }
  };

  const handleTabKeyDown = (
    keyboardEvent: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (keyboardEvent.key !== "ArrowLeft" && keyboardEvent.key !== "ArrowRight") {
      return;
    }

    keyboardEvent.preventDefault();
    setActiveCategory((currentCategory) =>
      currentCategory === "images" ? "videos" : "images",
    );
  };

  if (isLoading) return <PageLoader visible />;

  if (!event) {
    return (
      <div className="font-nunito flex min-h-80 w-full flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="text-xl font-semibold text-slate-700">
          {t("events.details.notFound")}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          {t("events.details.back")}
        </Link>
      </div>
    );
  }

  const photos = (event.images || []) as MediaItem[];
  const videos = (event.videos || []) as MediaItem[];

  return (
    <div className="font-nunito w-full px-3 py-8 md:px-4">
      <PageLoader visible={isBannerLoading} />

      <div className="mx-auto w-full max-w-7xl">
        <Link
          to="/events"
          className="mb-8 inline-flex items-center gap-2 rounded-xl px-1 py-2 font-semibold text-blue-700 transition-colors hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          {t("events.details.back")}
        </Link>

        <article className="mb-12 grid grid-cols-1 overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.1)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="relative aspect-video min-h-56 overflow-hidden bg-slate-100 md:aspect-auto md:min-h-90">
            {event.imageBanner ? (
              <img
                src={getCloudinaryUrl(
                  event.imageBanner,
                  "f_auto,q_auto:good,c_fill,g_auto,w_1400,h_900",
                )}
                alt={title || t("events.details.eventImage")}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onLoad={() => setIsBannerLoading(false)}
                onError={() => setIsBannerLoading(false)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <ImageIcon size={54} aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col justify-center p-5 md:p-7 lg:p-8">
            <h1 className="text-3xl leading-tight font-semibold tracking-tight text-slate-950 md:text-4xl">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2.5 text-sm font-semibold">
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
                <div className="flex min-w-0 items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-900">
                  <MapPin size={17} className="shrink-0" aria-hidden="true" />
                  <span className="wrap-break-word">{event.location}</span>
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
                    aria-expanded={isDescriptionExpanded}
                    className="mt-3 cursor-pointer font-semibold text-blue-700 transition-colors hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {t(
                      isDescriptionExpanded
                        ? "events.details.showLess"
                        : "events.details.showMore",
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </article>

        <section aria-labelledby="event-media-title">
          <h2 id="event-media-title" className="sr-only">
            {t("events.details.media")}
          </h2>

          <div className="mb-8 flex justify-center">
            <div
              role="tablist"
              aria-label={t("events.details.media")}
              className="grid w-full max-w-xl grid-cols-2 rounded-2xl border border-slate-200 bg-slate-100 p-1.5"
            >
              <button
                id="event-photos-tab"
                type="button"
                role="tab"
                aria-selected={activeCategory === "images"}
                aria-controls="event-photos-panel"
                tabIndex={activeCategory === "images" ? 0 : -1}
                onKeyDown={handleTabKeyDown}
                onClick={() => setActiveCategory("images")}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all md:px-4 md:text-base ${
                  activeCategory === "images"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <Camera size={19} aria-hidden="true" />
                {t("events.details.photos")}
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                  {photos.length}
                </span>
              </button>

              <button
                id="event-videos-tab"
                type="button"
                role="tab"
                aria-selected={activeCategory === "videos"}
                aria-controls="event-videos-panel"
                tabIndex={activeCategory === "videos" ? 0 : -1}
                onKeyDown={handleTabKeyDown}
                onClick={() => setActiveCategory("videos")}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all md:px-4 md:text-base ${
                  activeCategory === "videos"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <Video size={19} aria-hidden="true" />
                {t("events.details.videos")}
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                  {videos.length}
                </span>
              </button>
            </div>
          </div>

          {activeCategory === "images" && (
            <div
              id="event-photos-panel"
              role="tabpanel"
              aria-labelledby="event-photos-tab"
              tabIndex={0}
            >
              {photos.length > 0 || isAdmin ? (
                <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {isAdmin && (
                    <li className="aspect-square">
                      <button
                        type="button"
                        onClick={() => handleOpenUpload("image")}
                        className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-6 text-center text-blue-700 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-50 hover:shadow-[0_14px_35px_rgba(37,99,235,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                          <Plus size={36} strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <span className="font-semibold">
                          {t("events.details.addPhoto")}
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
                        aria-label={`${t("events.details.openPhoto")}: ${image.alt || title}`}
                        className="h-full w-full cursor-zoom-in"
                      >
                        <img
                          src={getCloudinaryUrl(
                            image.url,
                            "f_auto,q_auto:good,c_fill,g_auto,w_800,h_800",
                          )}
                          alt={image.alt || title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => void handleDeleteMedia(image, "images")}
                          disabled={deletingMediaId !== null}
                          aria-label={`${t("events.details.deletePhoto")}: ${image.alt || title}`}
                          title={t("events.details.deletePhoto")}
                          className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/40 bg-red-600 text-white shadow-lg transition-all hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-wait disabled:opacity-60"
                        >
                          {deletingMediaId === image.id ? (
                            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                          ) : (
                            <Trash2 size={18} aria-hidden="true" />
                          )}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyMediaState
                  icon={Camera}
                  text={t("events.details.noPhotos")}
                />
              )}
            </div>
          )}

          {activeCategory === "videos" && (
            <div
              id="event-videos-panel"
              role="tabpanel"
              aria-labelledby="event-videos-tab"
              tabIndex={0}
            >
              {videos.length > 0 || isAdmin ? (
                <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {isAdmin && (
                    <li className="aspect-video">
                      <button
                        type="button"
                        onClick={() => handleOpenUpload("video")}
                        className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/60 p-5 text-center text-purple-700 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:bg-purple-50 hover:shadow-[0_14px_35px_rgba(147,51,234,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                      >
                        <span className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                          <Plus size={32} strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <span className="font-semibold">
                          {t("events.details.addVideo")}
                        </span>
                      </button>
                    </li>
                  )}

                  {videos.map((video) => {
                    const videoId = getYouTubeId(video.url);

                    return (
                      <li
                        key={video.id}
                        className="group relative aspect-video overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-purple-950 shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white/80">
                          <Video size={34} strokeWidth={1.5} aria-hidden="true" />
                          <span className="line-clamp-2 text-sm font-semibold">
                            {video.alt || title}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => videoId && setSelectedMedia(video)}
                          disabled={!videoId}
                          aria-label={`${t("events.details.playVideo")}: ${video.alt || title}`}
                          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/10 transition-colors hover:bg-black/25 disabled:cursor-not-allowed"
                        >
                          <span className="flex size-16 items-center justify-center rounded-full border border-white/50 bg-white/20 text-white shadow-xl backdrop-blur-md transition-transform group-hover:scale-110">
                            <Play size={28} className="ml-1 fill-current" aria-hidden="true" />
                          </span>
                        </button>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => void handleDeleteMedia(video, "videos")}
                            disabled={deletingMediaId !== null}
                            aria-label={`${t("events.details.deleteVideo")}: ${video.alt || title}`}
                            title={t("events.details.deleteVideo")}
                            className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/40 bg-red-600 text-white shadow-lg transition-all hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-wait disabled:opacity-60"
                          >
                            {deletingMediaId === video.id ? (
                              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                            ) : (
                              <Trash2 size={18} aria-hidden="true" />
                            )}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <EmptyMediaState
                  icon={Video}
                  text={t("events.details.noVideos")}
                />
              )}
            </div>
          )}
        </section>
      </div>

      {selectedMedia && (
        <MediaViewer
          item={selectedMedia}
          title={title}
          closeLabel={t("events.details.close")}
          dialogLabel={t(
            selectedMedia.type === "video"
              ? "events.details.videos"
              : "events.details.photos",
          )}
          onClose={() => setSelectedMedia(null)}
        />
      )}

      <AddMediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleAddMedia}
        type={mediaType}
        title={title || t("events.details.eventMedia")}
        subFolder={eventId || "general"}
      />
    </div>
  );
};

interface EmptyMediaStateProps {
  icon: typeof Camera;
  text: string;
}

const EmptyMediaState = ({ icon: Icon, text }: EmptyMediaStateProps) => (
  <div
    role="status"
    className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-slate-600"
  >
    <Icon size={34} className="mb-4 text-slate-400" aria-hidden="true" />
    <p className="text-base font-medium">{text}</p>
  </div>
);

interface MediaViewerProps {
  item: MediaItem;
  title: string;
  closeLabel: string;
  dialogLabel: string;
  onClose: () => void;
}

const MediaViewer = ({
  item,
  title,
  closeLabel,
  dialogLabel,
  onClose,
}: MediaViewerProps) => {
  const videoId = item.type === "video" ? getYouTubeId(item.url) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-6xl items-center justify-center pt-12"
        onClick={(mouseEvent) => mouseEvent.stopPropagation()}
      >
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label={closeLabel}
          title={closeLabel}
          className="absolute top-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X size={24} aria-hidden="true" />
        </button>

        {item.type === "video" && videoId ? (
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={item.alt || title}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <img
            src={getCloudinaryUrl(
              item.url,
              "f_auto,q_auto:good,c_limit,w_1800,h_1400",
            )}
            alt={item.alt || title}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        )}
      </div>
    </div>
  );
};
