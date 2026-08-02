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
  AlertTriangle,
  Check,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import type { AgeGroup } from "../../types/ageGroup";
import type { Program } from "../../types/program";
import type { LangKey } from "../../types/types";
import { COLORS, type LessonColor } from "../../data/colors";
import { AVAILABLE_ICONS, type IconName } from "../../data/icons";
import { uploadMedia } from "../../services/cloudinaryService";

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Program, "id">, id?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  ageGroups: AgeGroup[];
  programToEdit?: Program | null;
}

type LocalizedText = Record<LangKey, string>;

interface LessonFormState {
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  color: LessonColor;
  ageGroupIds: string[];
  iconName: IconName;
}

const LANGUAGES: Array<{ key: LangKey; label: string }> = [
  { key: "ua", label: "UA" },
  { key: "de", label: "DE" },
  { key: "en", label: "EN" },
];

const TEXT = {
  ua: {
    admin: "Berehynja Admin",
    createTitle: "Створення програми",
    editTitle: "Редагування програми",
    close: "Закрити",
    contentLanguage: "Мова заповнення",
    illustration: "Ілюстрація програми",
    required: "обов’язково",
    upload: "Вибрати зображення",
    replace: "Замінити",
    remove: "Прибрати",
    uploading: "Завантаження...",
    title: "Назва заняття",
    titlePlaceholder: "Наприклад, малювання",
    description: "Опис програми",
    descriptionPlaceholder: "Коротко опишіть заняття...",
    accent: "Колір акценту",
    icon: "Іконка програми",
    groups: "Цільові групи",
    oneGroup: "виберіть щонайменше одну",
    noGroups: "Вікові групи ще не додані.",
    cancel: "Скасувати",
    create: "Створити програму",
    save: "Зберегти зміни",
    saving: "Збереження...",
    delete: "Видалити програму",
    deleteTitle: "Видалити програму?",
    deleteMessage:
      "Цю дію неможливо скасувати. Програма буде видалена назавжди.",
    deleting: "Видалення...",
    confirmDelete: "Так, видалити",
    uploaded: "Зображення завантажено.",
    uploadError: "Не вдалося завантажити зображення.",
    validation:
      "Заповніть назву українською, додайте зображення та виберіть вікову групу.",
    saved: "Програму збережено.",
    saveError: "Не вдалося зберегти програму.",
    deleted: "Програму видалено.",
    deleteError: "Не вдалося видалити програму.",
  },
  de: {
    admin: "Berehynja Admin",
    createTitle: "Programm erstellen",
    editTitle: "Programm bearbeiten",
    close: "Schließen",
    contentLanguage: "Eingabesprache",
    illustration: "Programmbild",
    required: "erforderlich",
    upload: "Bild auswählen",
    replace: "Ersetzen",
    remove: "Entfernen",
    uploading: "Wird hochgeladen...",
    title: "Kurstitel",
    titlePlaceholder: "Zum Beispiel Malen",
    description: "Programmbeschreibung",
    descriptionPlaceholder: "Beschreiben Sie den Kurs kurz...",
    accent: "Akzentfarbe",
    icon: "Programmsymbol",
    groups: "Zielgruppen",
    oneGroup: "mindestens eine auswählen",
    noGroups: "Es wurden noch keine Altersgruppen hinzugefügt.",
    cancel: "Abbrechen",
    create: "Programm erstellen",
    save: "Änderungen speichern",
    saving: "Wird gespeichert...",
    delete: "Programm löschen",
    deleteTitle: "Programm löschen?",
    deleteMessage:
      "Diese Aktion kann nicht rückgängig gemacht werden. Das Programm wird dauerhaft gelöscht.",
    deleting: "Wird gelöscht...",
    confirmDelete: "Ja, löschen",
    uploaded: "Das Bild wurde hochgeladen.",
    uploadError: "Das Bild konnte nicht hochgeladen werden.",
    validation:
      "Füllen Sie den ukrainischen Titel aus, laden Sie ein Bild hoch und wählen Sie eine Altersgruppe.",
    saved: "Das Programm wurde gespeichert.",
    saveError: "Das Programm konnte nicht gespeichert werden.",
    deleted: "Das Programm wurde gelöscht.",
    deleteError: "Das Programm konnte nicht gelöscht werden.",
  },
  en: {
    admin: "Berehynja Admin",
    createTitle: "Create program",
    editTitle: "Edit program",
    close: "Close",
    contentLanguage: "Content language",
    illustration: "Program image",
    required: "required",
    upload: "Choose image",
    replace: "Replace",
    remove: "Remove",
    uploading: "Uploading...",
    title: "Lesson title",
    titlePlaceholder: "For example, painting",
    description: "Program description",
    descriptionPlaceholder: "Briefly describe the lesson...",
    accent: "Accent color",
    icon: "Program icon",
    groups: "Target groups",
    oneGroup: "select at least one",
    noGroups: "No age groups have been added yet.",
    cancel: "Cancel",
    create: "Create program",
    save: "Save changes",
    saving: "Saving...",
    delete: "Delete program",
    deleteTitle: "Delete program?",
    deleteMessage:
      "This action cannot be undone. The program will be permanently deleted.",
    deleting: "Deleting...",
    confirmDelete: "Yes, delete",
    uploaded: "The image has been uploaded.",
    uploadError: "The image could not be uploaded.",
    validation:
      "Enter the Ukrainian title, upload an image, and select an age group.",
    saved: "The program has been saved.",
    saveError: "The program could not be saved.",
    deleted: "The program has been deleted.",
    deleteError: "The program could not be deleted.",
  },
} as const;

const EMPTY_LOCALIZED_TEXT: LocalizedText = { ua: "", de: "", en: "" };

const normalizeLocalizedText = (value: unknown): LocalizedText => {
  if (typeof value === "string") {
    return { ...EMPTY_LOCALIZED_TEXT, ua: value };
  }

  if (value && typeof value === "object") {
    const localized = value as Partial<LocalizedText>;
    return {
      ua: localized.ua ?? "",
      de: localized.de ?? "",
      en: localized.en ?? "",
    };
  }

  return { ...EMPTY_LOCALIZED_TEXT };
};

const createInitialState = (program?: Program | null): LessonFormState => ({
  title: normalizeLocalizedText(program?.title),
  description: normalizeLocalizedText(program?.description),
  image: program?.image ?? "",
  color: program?.color ?? "RoyalBlue",
  ageGroupIds: program?.ageGroupIds ?? [],
  iconName: program?.iconName ?? "sparkles",
});

export function AddLessonModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  ageGroups,
  programToEdit,
}: AddLessonModalProps) {
  const { i18n } = useTranslation();
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language)
    .split("-")[0]
    .toLowerCase();
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";
  const text = TEXT[currentLang];

  const [activeLang, setActiveLang] = useState<LangKey>("ua");
  const [form, setForm] = useState<LessonFormState>(() =>
    createInitialState(programToEdit),
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isBusy = isUploading || isSubmitting || isDeleting;

  const handleClose = useCallback(() => {
    if (isBusy) return;
    setIsDeleteModalOpen(false);
    onClose();
  }, [isBusy, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    setForm(createInitialState(programToEdit));
    setActiveLang("ua");
    setIsDeleteModalOpen(false);
  }, [isOpen, programToEdit]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isBusy) return;

      if (isDeleteModalOpen) {
        setIsDeleteModalOpen(false);
      } else {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isBusy, isDeleteModalOpen, isOpen, onClose]);

  const updateLocalizedField = (
    field: "title" | "description",
    value: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: { ...previous[field], [activeLang]: value },
    }));
  };

  const toggleAgeGroup = (id: string) => {
    setForm((previous) => ({
      ...previous,
      ageGroupIds: previous.ageGroupIds.includes(id)
        ? previous.ageGroupIds.filter((ageId) => ageId !== id)
        : [...previous.ageGroupIds, id],
    }));
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const folderName =
        form.title.ua.trim() || form.title[activeLang].trim() || "program";
      const result = await uploadMedia(file, "programs", folderName);

      setForm((previous) => ({ ...previous, image: result.url }));
      toast.success(text.uploaded);
    } catch (error) {
      console.error("Program image upload error:", error);
      toast.error(text.uploadError);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    if (!form.title.ua.trim() || !form.image || form.ageGroupIds.length === 0) {
      setActiveLang("ua");
      toast.error(text.validation);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(
        {
          ...form,
          title: {
            ua: form.title.ua.trim(),
            de: form.title.de.trim(),
            en: form.title.en.trim(),
          },
          description: {
            ua: form.description.ua.trim(),
            de: form.description.de.trim(),
            en: form.description.en.trim(),
          },
        },
        programToEdit?.id,
      );
      toast.success(text.saved);
      onClose();
    } catch (error) {
      console.error("Program save error:", error);
      toast.error(text.saveError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!programToEdit?.id || isBusy) return;

    setIsDeleting(true);

    try {
      await onDelete(programToEdit.id);
      toast.success(text.deleted);
      setIsDeleteModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Program delete error:", error);
      toast.error(text.deleteError);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="font-nunito fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-6">
      <button
        type="button"
        aria-label={text.close}
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-slate-950/65 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.35)]"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 md:px-8 md:py-5">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-black tracking-[0.2em] text-blue-600 uppercase">
              {text.admin}
            </p>
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl"
            >
              {programToEdit ? text.editTitle : text.createTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            aria-label={text.close}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </header>

        <form
          id="lesson-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-6 md:px-8 md:py-7"
        >
          <div className="space-y-7">
            <section aria-labelledby={`${titleId}-language`}>
              <p
                id={`${titleId}-language`}
                className="mb-3 text-xs font-black tracking-[0.15em] text-slate-500 uppercase"
              >
                {text.contentLanguage}
              </p>

              <div
                role="tablist"
                aria-label={text.contentLanguage}
                className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1.5"
              >
                {LANGUAGES.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={activeLang === key}
                    onClick={() => setActiveLang(key)}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-extrabold transition ${
                      activeLang === key
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {label}
                    {form.title[key].trim() && (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex flex-wrap items-baseline gap-2">
                <h3 className="text-sm font-extrabold text-slate-800">
                  {text.illustration}
                </h3>
                <span className="text-xs font-bold text-blue-600">
                  {text.required}
                </span>
              </div>

              {form.image ? (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                  <div className="aspect-16/7 overflow-hidden">
                    <img
                      src={form.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white p-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
                    >
                      {isUploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {isUploading ? text.uploading : text.replace}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setForm((previous) => ({ ...previous, image: "" }))
                      }
                      disabled={isUploading}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      {text.remove}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70"
                >
                  <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                    {isUploading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <ImageIcon size={24} />
                    )}
                  </span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {isUploading ? text.uploading : text.upload}
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </section>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-extrabold text-slate-800">
                  {text.title} ({activeLang.toUpperCase()})
                  {activeLang === "ua" && (
                    <span className="ml-2 text-xs text-blue-600">
                      {text.required}
                    </span>
                  )}
                </span>
                <input
                  type="text"
                  value={form.title[activeLang]}
                  onChange={(event) =>
                    updateLocalizedField("title", event.target.value)
                  }
                  placeholder={text.titlePlaceholder}
                  required={activeLang === "ua"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-extrabold text-slate-800">
                  {text.description} ({activeLang.toUpperCase()})
                </span>
                <textarea
                  value={form.description[activeLang]}
                  onChange={(event) =>
                    updateLocalizedField("description", event.target.value)
                  }
                  placeholder={text.descriptionPlaceholder}
                  rows={4}
                  className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </label>
            </div>

            <section>
              <h3 className="mb-3 text-sm font-extrabold text-slate-800">
                {text.accent}
              </h3>
              <div className="flex flex-wrap gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {Object.entries(COLORS).map(([name, hex]) => {
                  const isSelected = form.color === name;

                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      aria-label={name}
                      aria-pressed={isSelected}
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          color: name as LessonColor,
                        }))
                      }
                      className={`flex size-9 cursor-pointer items-center justify-center rounded-full border-2 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                        isSelected
                          ? "scale-110 border-slate-800 shadow-md"
                          : "border-white shadow-sm"
                      }`}
                      style={{ backgroundColor: hex }}
                    >
                      {isSelected && (
                        <Check size={16} className="text-white drop-shadow" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-extrabold text-slate-800">
                {text.icon}
              </h3>
              <div className="grid grid-cols-5 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-8">
                {Object.entries(AVAILABLE_ICONS).map(([name, Icon]) => {
                  const isSelected = form.iconName === name;

                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      aria-label={name}
                      aria-pressed={isSelected}
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          iconName: name as IconName,
                        }))
                      }
                      className={`flex aspect-square cursor-pointer items-center justify-center rounded-xl border transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      <Icon size={19} />
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="mb-3 flex flex-wrap items-baseline gap-2">
                <h3 className="text-sm font-extrabold text-slate-800">
                  {text.groups}
                </h3>
                <span className="text-xs font-bold text-blue-600">
                  {text.oneGroup}
                </span>
              </div>

              {ageGroups.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {ageGroups.map((group) => {
                    const isSelected = form.ageGroupIds.includes(group.id);

                    return (
                      <label
                        key={group.id}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-2xl border px-4 py-3 transition ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-800 shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleAgeGroup(group.id)}
                          className="size-4 accent-blue-600"
                        />
                        <span className="text-sm font-bold">{group.label}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                  {text.noGroups}
                </p>
              )}
            </section>
          </div>
        </form>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            {programToEdit && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isBusy}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-extrabold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              >
                <Trash2 size={18} />
                {text.delete}
              </button>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 md:flex-row">
            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {text.cancel}
            </button>
            <button
              type="submit"
              form="lesson-form"
              disabled={isBusy}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting
                ? text.saving
                : programToEdit
                  ? text.save
                  : text.create}
            </button>
          </div>
        </footer>
      </div>

      {isDeleteModalOpen && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-delete-title`}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl"
          >
            <div className="flex items-start gap-4 p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={23} />
              </span>
              <div>
                <h3
                  id={`${titleId}-delete-title`}
                  className="text-lg font-extrabold text-slate-950"
                >
                  {text.deleteTitle}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {text.deleteMessage}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 p-4 md:flex-row md:justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {text.cancel}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
              >
                {isDeleting && <Loader2 size={17} className="animate-spin" />}
                {isDeleting ? text.deleting : text.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
