import { useCallback, useEffect, useId, useState, type ChangeEvent, type FormEvent } from "react";
import { Calendar, CheckCircle2, Clock, Loader2, MapPin, Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { uploadMedia } from "../../services/cloudinaryService";
import type { Event } from "../../types/event";
import type { LangKey } from "../../types/types";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Event) => void | Promise<void>;
  eventToEdit?: Event | null;
  onDelete?: (eventId: string) => void | Promise<void>;
}

type LocalizedField = "titles" | "descriptions";

const LANGUAGES: LangKey[] = ["ua", "de", "en"];

const createEmptyEvent = (): Event => ({
  titles: { ua: "", de: "", en: "" },
  descriptions: { ua: "", de: "", en: "" },
  date: "",
  time: "",
  location: "",
  imageBanner: "",
  images: [],
  videos: [],
});

const createFormData = (event?: Event | null): Event => {
  const emptyEvent = createEmptyEvent();
  if (!event) return emptyEvent;

  const legacyEvent = event as Event & {
    title?: string;
    description?: string;
  };

  return {
    ...emptyEvent,
    ...event,
    titles: {
      ...emptyEvent.titles,
      ...(event.titles || {}),
      ua: event.titles?.ua || legacyEvent.title || "",
    },
    descriptions: {
      ...emptyEvent.descriptions,
      ...(event.descriptions || {}),
      ua: event.descriptions?.ua || legacyEvent.description || "",
    },
    images: event.images || [],
    videos: event.videos || [],
  };
};

const EVENT_MODAL_TEXT = {
  createTitle: {
    ua: "Створення події",
    de: "Veranstaltung erstellen",
    en: "Create event",
  },
  editTitle: {
    ua: "Редагування події",
    de: "Veranstaltung bearbeiten",
    en: "Edit event",
  },
  close: {
    ua: "Закрити форму",
    de: "Formular schließen",
    en: "Close form",
  },
  date: {
    ua: "Дата",
    de: "Datum",
    en: "Date",
  },
  time: {
    ua: "Час",
    de: "Uhrzeit",
    en: "Time",
  },
  location: {
    ua: "Локація",
    de: "Ort",
    en: "Location",
  },
  eventTitle: {
    ua: "Назва події",
    de: "Veranstaltungstitel",
    en: "Event title",
  },
  titlePlaceholder: {
    ua: "Введіть назву події...",
    de: "Veranstaltungstitel eingeben...",
    en: "Enter event title...",
  },
  description: {
    ua: "Опис",
    de: "Beschreibung",
    en: "Description",
  },
  descriptionPlaceholder: {
    ua: "Опишіть подію детальніше...",
    de: "Beschreiben Sie die Veranstaltung...",
    en: "Describe the event...",
  },
  mainImage: {
    ua: "Головне зображення",
    de: "Hauptbild",
    en: "Main image",
  },
  changeImage: {
    ua: "Змінити",
    de: "Ändern",
    en: "Change",
  },
  removeImage: {
    ua: "Видалити",
    de: "Entfernen",
    en: "Remove",
  },
  addImage: {
    ua: "Натисніть, щоб додати фото",
    de: "Klicken, um ein Foto hinzuzufügen",
    en: "Click to add a photo",
  },
  uploading: {
    ua: "Завантаження...",
    de: "Wird hochgeladen...",
    en: "Uploading...",
  },
  deleteEvent: {
    ua: "Видалити подію",
    de: "Veranstaltung löschen",
    en: "Delete event",
  },
  cancel: {
    ua: "Скасувати",
    de: "Abbrechen",
    en: "Cancel",
  },
  publish: {
    ua: "Опублікувати",
    de: "Veröffentlichen",
    en: "Publish",
  },
  saveChanges: {
    ua: "Зберегти зміни",
    de: "Änderungen speichern",
    en: "Save changes",
  },
  saving: {
    ua: "Збереження...",
    de: "Wird gespeichert...",
    en: "Saving...",
  },
  titleRequired: {
    ua: "Додайте українську назву події.",
    de: "Bitte geben Sie einen ukrainischen Veranstaltungstitel ein.",
    en: "Please add the Ukrainian event title.",
  },
  uploadError: {
    ua: "Не вдалося завантажити зображення.",
    de: "Das Bild konnte nicht hochgeladen werden.",
    en: "The image could not be uploaded.",
  },
  saveError: {
    ua: "Не вдалося зберегти подію.",
    de: "Die Veranstaltung konnte nicht gespeichert werden.",
    en: "The event could not be saved.",
  },
  deleteError: {
    ua: "Не вдалося видалити подію.",
    de: "Die Veranstaltung konnte nicht gelöscht werden.",
    en: "The event could not be deleted.",
  },
};

export const AddEventModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  eventToEdit,
}: AddEventModalProps) => {
  const { i18n } = useTranslation();
  const titleId = useId();
  const [activeLang, setActiveLang] = useState<LangKey>("ua");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<Event>(() => createFormData(eventToEdit));

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language).split("-")[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  const isBusy = isUploading || isSubmitting || isDeleting;

  const handleClose = useCallback(() => {
    if (isBusy) return;
    onClose();
  }, [isBusy, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    setFormData(createFormData(eventToEdit));
    setActiveLang("ua");
  }, [eventToEdit, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [handleClose, isOpen]);

  const handleLocalizedChange = (field: LocalizedField, value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: {
        ...currentData[field],
        [activeLang]: value,
      },
    }));
  };

  const handleBannerUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isBusy) return;

    setIsUploading(true);

    try {
      const result = await uploadMedia(file, "banners", formData.titles.ua.trim() || "event");
      setFormData((currentData) => ({
        ...currentData,
        imageBanner: result.url,
      }));
    } catch (error) {
      console.error("Event banner upload error:", error);
      toast.error(EVENT_MODAL_TEXT.uploadError[currentLang]);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    if (!formData.titles.ua.trim()) {
      setActiveLang("ua");
      toast.error(EVENT_MODAL_TEXT.titleRequired[currentLang]);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Event form submission error:", error);
      toast.error(EVENT_MODAL_TEXT.saveError[currentLang]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToEdit?.id || !onDelete || isBusy) return;

    setIsDeleting(true);

    try {
      await onDelete(eventToEdit.id);
    } catch (error) {
      console.error("Event form deletion error:", error);
      toast.error(EVENT_MODAL_TEXT.deleteError[currentLang]);
    } finally {
      setIsDeleting(false);
    }
  };

  const isLanguageFilled = (language: LangKey) => formData.titles[language].trim().length > 2;

  if (!isOpen) return null;

  const modalTitle = eventToEdit
    ? EVENT_MODAL_TEXT.editTitle[currentLang]
    : EVENT_MODAL_TEXT.createTitle[currentLang];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
        onMouseDown={handleClose}
      />

      <div className="animate-in zoom-in-95 font-nunito relative flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.3)] duration-200">
        <header className="flex shrink-0 items-start justify-between gap-5 border-b border-slate-100 px-6 py-5 md:px-8 md:py-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl"
            >
              {modalTitle}
            </h2>
            <p className="mt-1 text-[11px] font-black tracking-[0.2em] text-blue-700 uppercase">
              Berehynja Admin
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            aria-label={EVENT_MODAL_TEXT.close[currentLang]}
            title={EVENT_MODAL_TEXT.close[currentLang]}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-blue-300 hover:text-blue-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 md:p-8"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="ml-1 flex items-center gap-2 text-[11px] font-black tracking-wider text-slate-600 uppercase">
                <Calendar size={15} className="text-blue-600" aria-hidden="true" />
                {EVENT_MODAL_TEXT.date[currentLang]}
              </span>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={(event) =>
                  setFormData((currentData) => ({
                    ...currentData,
                    date: event.target.value,
                  }))
                }
                required
                className={`w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold shadow-sm transition-all outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 ${
                  formData.date ? "text-slate-950" : "text-slate-400"
                }`}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="ml-1 flex items-center gap-2 text-[11px] font-black tracking-wider text-slate-600 uppercase">
                <Clock size={15} className="text-purple-600" aria-hidden="true" />
                {EVENT_MODAL_TEXT.time[currentLang]}
              </span>
              <input
                name="time"
                placeholder="12:00 – 18:00"
                value={formData.time}
                onChange={(event) =>
                  setFormData((currentData) => ({
                    ...currentData,
                    time: event.target.value,
                  }))
                }
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-500 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="ml-1 flex items-center gap-2 text-[11px] font-black tracking-wider text-slate-600 uppercase">
                <MapPin size={15} className="text-red-600" aria-hidden="true" />
                {EVENT_MODAL_TEXT.location[currentLang]}
              </span>
              <input
                name="location"
                placeholder="Berlin, Germany"
                value={formData.location}
                onChange={(event) =>
                  setFormData((currentData) => ({
                    ...currentData,
                    location: event.target.value,
                  }))
                }
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-500 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <div
            role="tablist"
            aria-label="Language"
            className="flex rounded-xl border border-slate-200 bg-slate-100 p-1"
          >
            {LANGUAGES.map((language) => (
              <button
                key={language}
                type="button"
                role="tab"
                aria-selected={activeLang === language}
                onClick={() => setActiveLang(language)}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase transition-all ${
                  activeLang === language
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {language}
                {isLanguageFilled(language) && (
                  <CheckCircle2 size={14} className="text-emerald-600" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="ml-1 text-[11px] font-black tracking-wider text-slate-600 uppercase">
                {EVENT_MODAL_TEXT.eventTitle[currentLang]} ({activeLang})
              </span>
              <input
                value={formData.titles[activeLang]}
                onChange={(event) => handleLocalizedChange("titles", event.target.value)}
                placeholder={EVENT_MODAL_TEXT.titlePlaceholder[currentLang]}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-lg font-bold text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="ml-1 text-[11px] font-black tracking-wider text-slate-600 uppercase">
                {EVENT_MODAL_TEXT.description[currentLang]} ({activeLang})
              </span>
              <textarea
                rows={4}
                value={formData.descriptions[activeLang]}
                onChange={(event) => handleLocalizedChange("descriptions", event.target.value)}
                placeholder={EVENT_MODAL_TEXT.descriptionPlaceholder[currentLang]}
                className="w-full resize-y rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm leading-7 font-medium text-slate-950 shadow-sm transition-all outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="ml-1 text-[11px] font-black tracking-wider text-slate-600 uppercase">
              {EVENT_MODAL_TEXT.mainImage[currentLang]}
            </span>

            {formData.imageBanner ? (
              <div className="group relative h-40 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <img
                  src={formData.imageBanner}
                  alt={formData.titles[activeLang] || modalTitle}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 bg-linear-to-t from-slate-950/80 to-transparent p-4 pt-10">
                  <label className="cursor-pointer rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-950 shadow-sm transition-colors hover:bg-blue-50">
                    {isUploading
                      ? EVENT_MODAL_TEXT.uploading[currentLang]
                      : EVENT_MODAL_TEXT.changeImage[currentLang]}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      disabled={isBusy}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((currentData) => ({
                        ...currentData,
                        imageBanner: "",
                      }))
                    }
                    disabled={isBusy}
                    className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {EVENT_MODAL_TEXT.removeImage[currentLang]}
                  </button>
                </div>
              </div>
            ) : (
              <label className="group flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                  {isUploading ? (
                    <Loader2 size={21} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Plus size={22} aria-hidden="true" />
                  )}
                </span>
                <span className="text-xs font-black tracking-widest uppercase">
                  {isUploading
                    ? EVENT_MODAL_TEXT.uploading[currentLang]
                    : EVENT_MODAL_TEXT.addImage[currentLang]}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  disabled={isBusy}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <footer className="mt-2 flex flex-col gap-4 border-t border-slate-100 pt-6 md:flex-row md:items-center md:justify-between">
            <div>
              {eventToEdit?.id && onDelete && (
                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={isBusy}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold tracking-widest text-red-600 uppercase transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                >
                  {isDeleting ? (
                    <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 size={17} aria-hidden="true" />
                  )}
                  {EVENT_MODAL_TEXT.deleteEvent[currentLang]}
                </button>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 md:flex-row">
              <button
                type="button"
                onClick={handleClose}
                disabled={isBusy}
                className="cursor-pointer rounded-xl px-6 py-3 text-xs font-bold tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {EVENT_MODAL_TEXT.cancel[currentLang]}
              </button>

              <button
                type="submit"
                disabled={isBusy}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-xs font-bold tracking-widest text-white uppercase shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    {EVENT_MODAL_TEXT.saving[currentLang]}
                  </>
                ) : eventToEdit ? (
                  EVENT_MODAL_TEXT.saveChanges[currentLang]
                ) : (
                  EVENT_MODAL_TEXT.publish[currentLang]
                )}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};
