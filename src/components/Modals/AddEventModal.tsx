import { useState, useEffect, useMemo } from "react";
import type { Event } from "../../types/event";
import { uploadMedia } from "../../services/cloudinaryService";
import { Calendar, Clock, MapPin, CheckCircle2, X, Plus } from "lucide-react";
import type { LangKey } from "../../types/types";

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Event) => void;
  eventToEdit?: Event | null;
  onDelete?: (eventId: string) => void;
};

export const AddEventModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  eventToEdit,
}: AddEventModalProps) => {
  const [activeLang, setActiveLang] = useState<LangKey>("ua");
  const [isUploading, setIsUploading] = useState(false);

  const initialFormState = useMemo<Event>(
    () => ({
      titles: { ua: "", de: "", en: "" },
      descriptions: { ua: "", de: "", en: "" },
      date: "",
      time: "",
      location: "",
      imageBanner: "",
      images: [],
      videos: [],
    }),
    []
  );

  const [formData, setFormData] = useState<Event>(initialFormState);

  useEffect(() => {
    if (eventToEdit) {
      const normalized: Event = {
        ...initialFormState,
        ...eventToEdit,
        titles: eventToEdit.titles || {
          ua: (eventToEdit as unknown as { title: string }).title || "",
          de: "",
          en: "",
        },
        descriptions: eventToEdit.descriptions || {
          ua: (eventToEdit as unknown as { description: string }).description || "",
          de: "",
          en: "",
        },
      };
      setFormData(normalized);
    } else {
      setFormData(initialFormState);
    }
  }, [eventToEdit, isOpen, initialFormState]);

  const handleLangChange = (field: "titles" | "descriptions", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [activeLang]: value },
    }));
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadMedia(file, "banners", formData.titles.ua || "event");
      setFormData((prev) => ({ ...prev, imageBanner: result.url }));
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const isLangFilled = (lang: LangKey) => formData.titles[lang].length > 2;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-in zoom-in-95 w-full max-w-2xl overflow-hidden rounded-4xl bg-white shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Яскравіший та чіткіший */}
        <header className="flex items-center justify-between border-b border-slate-100 px-8 pt-8 pb-4">
          <div>
            <h2 className="font-nunito text-2xl tracking-tight text-slate-900 uppercase">
              {eventToEdit ? "Редагування події" : "Створення події"}
            </h2>
            <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase">
              Berehynja Admin
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={24} />
          </button>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
            onClose();
          }}
          className="font-nunito flex flex-col gap-6 p-8"
        >
          {/* Блок спільних даних - Чіткі межі */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="ml-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                <Calendar size={14} className="text-blue-600" /> Дата
              </label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition-all outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="ml-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                <Clock size={14} className="text-purple-600" /> Час
              </label>
              <input
                name="time"
                placeholder="12:00 — 18:00"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition-all outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="ml-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                <MapPin size={14} className="text-red-600" /> Локація
              </label>
              <input
                name="location"
                placeholder="Berlin, Germany"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition-all outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Перемикач мов - Високий контраст */}
          <div className="space-y-4">
            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              {(["ua", "de", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase transition-all duration-200 ${
                    activeLang === lang
                      ? "bg-white text-blue-700 shadow"
                      : "text-slate-500 hover:bg-gray-200 hover:text-slate-700"
                  }`}
                >
                  {lang}
                  {isLangFilled(lang) && <CheckCircle2 size={14} className="text-green-600" />}
                </button>
              ))}
            </div>

            {/* Поля введення контенту - Максимальна чіткість */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="ml-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Назва події ({activeLang})
                </label>
                <input
                  value={formData.titles[activeLang]}
                  onChange={(e) => handleLangChange("titles", e.target.value)}
                  placeholder={`Введіть назву мовою ${activeLang.toUpperCase()}...`}
                  className="font-nunito w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-lg text-slate-900 shadow-sm transition-all outline-none placeholder:text-slate-300 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="ml-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Опис ({activeLang})
                </label>
                <textarea
                  rows={4}
                  value={formData.descriptions[activeLang]}
                  onChange={(e) => handleLangChange("descriptions", e.target.value)}
                  placeholder={`Опишіть подію детальніше...`}
                  className="w-full resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed font-medium text-slate-900 shadow-sm transition-all outline-none placeholder:text-slate-300 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Завантаження фото - Яскравіший стан */}
          <div className="flex flex-col gap-1.5">
            <label className="ml-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Головне зображення
            </label>
            {formData.imageBanner ? (
              <div className="group relative h-32 w-full overflow-hidden rounded-xl border-2 border-slate-200">
                <img
                  src={formData.imageBanner}
                  className="h-full w-full object-cover"
                  alt="Banner"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/40 opacity-0 transition-all group-hover:opacity-100">
                  <label className="cursor-pointer rounded-lg bg-white px-4 py-2 text-[10px] font-bold text-slate-900 uppercase transition-colors hover:bg-blue-50">
                    Змінити
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageBanner: "" })}
                    className="rounded-lg bg-red-600 px-4 py-2 text-[10px] font-bold text-white uppercase transition-colors hover:bg-red-700"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ) : (
              <label className="group flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-blue-400 hover:bg-blue-50">
                <div className="rounded-full bg-white p-2 shadow-sm transition-transform group-hover:scale-110">
                  {isUploading ? (
                    <Clock className="animate-spin text-blue-600" size={18} />
                  ) : (
                    <Plus className="text-blue-600" size={18} />
                  )}
                </div>
                <span className="cursor-pointer text-[10px] font-bold tracking-widest text-slate-500 uppercase group-hover:text-blue-600">
                  {isUploading ? "Завантаження..." : "Натисніть, щоб додати фото"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}
          </div>

          {/* Footer - Помітні кнопки */}
          <footer className="mt-4 flex items-center justify-between border-t border-slate-100 pt-6">
            <div>
              {eventToEdit?.id && (
                <button
                  type="button"
                  onClick={() => onDelete?.(eventToEdit.id!)}
                  className="cursor-pointer text-[10px] font-bold tracking-widest text-red-500 uppercase transition-colors hover:text-red-700"
                >
                  Видалити подію
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-xl px-6 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-100"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="cursor-pointer rounded-xl bg-blue-600 px-10 py-3 text-[10px] font-bold tracking-widest text-white uppercase shadow-md shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:bg-slate-300"
              >
                {eventToEdit ? "Зберегти зміни" : "Опублікувати"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};
