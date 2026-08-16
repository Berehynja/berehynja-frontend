import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Hourglass,
  ImageIcon,
  ListChecks,
  Loader2,
  MapPin,
  Target,
  Trash2,
  Upload,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { uploadMedia } from "../../services/cloudinaryService";
import type { ProgramAdults } from "../../types/program";
import type { LangKey } from "../../types/types";

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProgramAdults) => void | Promise<void>;
  programToEdit?: ProgramAdults | null;
  onDelete?: (id: string) => void | Promise<void>;
}

type LocalizedField =
  | "title"
  | "description"
  | "duration"
  | "intensity"
  | "target"
  | "capacity"
  | "location";

interface DetailFieldConfig {
  field: "intensity" | "target" | "capacity" | "location";
  label: string;
  placeholder: string;
  icon: LucideIcon;
  iconClassName: string;
}

const LANGUAGES: Array<{ key: LangKey; label: string }> = [
  { key: "ua", label: "UA" },
  { key: "de", label: "DE" },
  { key: "en", label: "EN" },
];

const MAX_IMAGE_SIZE = 12 * 1024 * 1024;

const createEmptyProgram = (): ProgramAdults => ({
  id: "",
  title: { ua: "", de: "", en: "" },
  description: { ua: "", de: "", en: "" },
  dateRange: "",
  duration: { ua: "", de: "", en: "" },
  intensity: { ua: "", de: "", en: "" },
  target: { ua: "", de: "", en: "" },
  capacity: { ua: "", de: "", en: "" },
  image: "",
  location: { ua: "", de: "", en: "" },
  features: { ua: [], de: [], en: [] },
});

const createFormData = (program?: ProgramAdults | null): ProgramAdults => {
  const emptyProgram = createEmptyProgram();
  if (!program) return emptyProgram;

  return {
    ...emptyProgram,
    ...program,
    title: { ...emptyProgram.title, ...program.title },
    description: { ...emptyProgram.description, ...program.description },
    duration: { ...emptyProgram.duration, ...program.duration },
    intensity: { ...emptyProgram.intensity, ...program.intensity },
    target: { ...emptyProgram.target, ...program.target },
    capacity: { ...emptyProgram.capacity, ...program.capacity },
    location: { ...emptyProgram.location, ...program.location },
    features: {
      ua: [...(program.features?.ua ?? [])],
      de: [...(program.features?.de ?? [])],
      en: [...(program.features?.en ?? [])],
    },
  };
};

export const AddProgramModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  programToEdit,
}: AddProgramModalProps) => {
  const { t } = useTranslation();
  const tr = (key: string) => t(`admin.adultProgramModal.${key}`);
  const modalTitleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const [activeLang, setActiveLang] = useState<LangKey>("ua");
  const [formData, setFormData] = useState<ProgramAdults>(() =>
    createFormData(programToEdit),
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isBusy = isUploading || isSubmitting || isDeleting;

  const handleClose = useCallback(() => {
    if (isBusy) return;
    onClose();
  }, [isBusy, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setFormData(createFormData(programToEdit));
    setActiveLang("ua");
  }, [isOpen, programToEdit]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleClose, isOpen]);

  const handleLocalizedChange = (field: LocalizedField, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: { ...previous[field], [activeLang]: value },
    }));
  };

  const handleFeaturesChange = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      features: {
        ua: previous.features?.ua ?? [],
        de: previous.features?.de ?? [],
        en: previous.features?.en ?? [],
        [activeLang]: value.split("\n"),
      },
    }));
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isBusy) return;

    if (!file.type.startsWith("image/")) {
      toast.error(tr("invalidImage"));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(tr("imageTooLarge"));
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadMedia(
        file,
        "programs",
        formData.title.ua.trim() || "adult-program",
      );
      setFormData((previous) => ({ ...previous, image: result.url }));
      toast.success(tr("imageUploaded"));
    } catch (error) {
      console.error("Program image upload error:", error);
      toast.error(tr("uploadError"));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    if (!formData.title.ua.trim()) {
      setActiveLang("ua");
      toast.error(tr("titleRequired"));
      return;
    }

    const normalizedProgram: ProgramAdults = {
      ...formData,
      title: {
        ua: formData.title.ua.trim(),
        de: formData.title.de.trim(),
        en: formData.title.en.trim(),
      },
      description: {
        ua: formData.description.ua.trim(),
        de: formData.description.de.trim(),
        en: formData.description.en.trim(),
      },
      duration: {
        ua: formData.duration.ua.trim(),
        de: formData.duration.de.trim(),
        en: formData.duration.en.trim(),
      },
      intensity: {
        ua: formData.intensity.ua.trim(),
        de: formData.intensity.de.trim(),
        en: formData.intensity.en.trim(),
      },
      target: {
        ua: formData.target.ua.trim(),
        de: formData.target.de.trim(),
        en: formData.target.en.trim(),
      },
      capacity: {
        ua: formData.capacity.ua.trim(),
        de: formData.capacity.de.trim(),
        en: formData.capacity.en.trim(),
      },
      location: {
        ua: formData.location.ua.trim(),
        de: formData.location.de.trim(),
        en: formData.location.en.trim(),
      },
      dateRange: formData.dateRange.trim(),
      features: {
        ua: (formData.features?.ua ?? [])
          .map((item) => item.trim())
          .filter(Boolean),
        de: (formData.features?.de ?? [])
          .map((item) => item.trim())
          .filter(Boolean),
        en: (formData.features?.en ?? [])
          .map((item) => item.trim())
          .filter(Boolean),
      },
    };

    setIsSubmitting(true);

    try {
      await onSave(normalizedProgram);
    } catch (error) {
      console.error("Program save error:", error);
      toast.error(tr("saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!programToEdit?.id || !onDelete || isBusy) return;

    setIsDeleting(true);

    try {
      await onDelete(programToEdit.id);
    } catch (error) {
      console.error("Program delete error:", error);
      toast.error(tr("deleteError"));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  const modalTitle = programToEdit ? tr("editTitle") : tr("createTitle");
  const languageIsFilled = (language: LangKey) =>
    Boolean(formData.title[language].trim());

  const detailFields: DetailFieldConfig[] = [
    {
      field: "intensity",
      label: tr("schedule"),
      placeholder: tr("schedulePlaceholder"),
      icon: Clock,
      iconClassName: "text-orange-500",
    },
    {
      field: "target",
      label: tr("target"),
      placeholder: tr("targetPlaceholder"),
      icon: Target,
      iconClassName: "text-violet-600",
    },
    {
      field: "capacity",
      label: tr("capacity"),
      placeholder: tr("capacityPlaceholder"),
      icon: Users,
      iconClassName: "text-emerald-600",
    },
    {
      field: "location",
      label: tr("location"),
      placeholder: tr("locationPlaceholder"),
      icon: MapPin,
      iconClassName: "text-red-500",
    },
  ];

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="font-nunito fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-6">
      <button
        type="button"
        aria-label={tr("close")}
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-slate-950/65 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.35)]"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 bg-linear-to-br from-blue-600 to-blue-900 px-5 py-5 text-white md:px-8 md:py-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-yellow-300 shadow-inner backdrop-blur-md">
              <ListChecks size={24} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-blue-100 uppercase">
                {tr("admin")}
              </p>
              <h2
                id={modalTitleId}
                className="truncate text-xl font-semibold tracking-tight text-white md:text-2xl"
              >
                {modalTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            aria-label={tr("close")}
            title={tr("close")}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/15 bg-black/10 text-white shadow-sm backdrop-blur-md transition hover:bg-black/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={21} aria-hidden="true" />
          </button>
        </header>

        <form
          id="adult-program-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto bg-slate-50/60 px-5 py-6 md:px-8 md:py-7"
        >
          <div className="space-y-7">
            <section>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-800">
                  {tr("image")}
                </h3>
                <span className="text-xs text-slate-500">{tr("imageHint")}</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleImageUpload}
                disabled={isBusy}
                className="sr-only"
              />

              {formData.image ? (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                  <div className="aspect-[16/6] max-h-72 overflow-hidden">
                    <img
                      src={formData.image}
                      alt={formData.title[activeLang] || modalTitle}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white p-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isBusy}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isUploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {isUploading ? tr("uploading") : tr("changeImage")}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((previous) => ({
                          ...previous,
                          image: "",
                        }))
                      }
                      disabled={isBusy}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {tr("removeImage")}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isBusy}
                  className="flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-7 text-center transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70"
                >
                  <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                    {isUploading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <ImageIcon size={24} />
                    )}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {isUploading ? tr("uploading") : tr("addImage")}
                  </span>
                </button>
              )}
            </section>

            <section aria-labelledby={`${modalTitleId}-language`}>
              <p
                id={`${modalTitleId}-language`}
                className="mb-3 text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase"
              >
                {tr("language")}
              </p>

              <div
                role="tablist"
                aria-label={tr("language")}
                className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1.5"
              >
                {LANGUAGES.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={activeLang === key}
                    onClick={() => setActiveLang(key)}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                      activeLang === key
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {label}
                    {languageIsFilled(key) && (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Calendar size={17} className="text-blue-600" />
                  {tr("period")}
                </span>
                <input
                  type="text"
                  value={formData.dateRange}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      dateRange: event.target.value,
                    }))
                  }
                  placeholder={tr("periodPlaceholder")}
                  className={inputClassName}
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Hourglass size={17} className="text-blue-600" />
                  {tr("duration")} ({activeLang.toUpperCase()})
                </span>
                <input
                  type="text"
                  value={formData.duration[activeLang]}
                  onChange={(event) =>
                    handleLocalizedChange("duration", event.target.value)
                  }
                  placeholder={tr("durationPlaceholder")}
                  className={inputClassName}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                {tr("name")} ({activeLang.toUpperCase()})
                {activeLang === "ua" && (
                  <span className="ml-2 text-xs text-blue-600">
                    {tr("required")}
                  </span>
                )}
              </span>
              <input
                type="text"
                value={formData.title[activeLang]}
                onChange={(event) =>
                  handleLocalizedChange("title", event.target.value)
                }
                placeholder={tr("namePlaceholder")}
                className={inputClassName}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                {tr("description")} ({activeLang.toUpperCase()})
              </span>
              <textarea
                rows={4}
                value={formData.description[activeLang]}
                onChange={(event) =>
                  handleLocalizedChange("description", event.target.value)
                }
                placeholder={tr("descriptionPlaceholder")}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              {detailFields.map(
                ({ field, label, placeholder, icon: Icon, iconClassName }) => (
                  <label key={field} className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Icon size={17} className={iconClassName} />
                      {label} ({activeLang.toUpperCase()})
                    </span>
                    <input
                      type="text"
                      value={formData[field][activeLang]}
                      onChange={(event) =>
                        handleLocalizedChange(field, event.target.value)
                      }
                      placeholder={placeholder}
                      className={inputClassName}
                    />
                  </label>
                ),
              )}
            </div>

            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <ListChecks size={18} className="text-blue-600" />
                {tr("features")} ({activeLang.toUpperCase()})
              </span>
              <span className="mb-2 block text-xs text-slate-500">
                {tr("featuresHint")}
              </span>
              <textarea
                rows={5}
                value={(formData.features?.[activeLang] ?? []).join("\n")}
                onChange={(event) => handleFeaturesChange(event.target.value)}
                placeholder={tr("featuresPlaceholder")}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>
          </div>
        </form>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            {programToEdit?.id && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isBusy}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              >
                {isDeleting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                {tr("delete")}
              </button>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 md:flex-row">
            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tr("cancel")}
            </button>

            <button
              type="submit"
              form="adult-program-form"
              disabled={isBusy}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {isSubmitting
                ? tr("saving")
                : programToEdit
                  ? tr("save")
                  : tr("create")}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
