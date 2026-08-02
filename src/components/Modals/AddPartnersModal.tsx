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
  Check,
  CheckCircle2,
  ImageIcon,
  Link2,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { uploadMedia } from "../../services/cloudinaryService";
import type { Partner } from "../../types/partners";
import type { LangKey } from "../../types/types";

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Omit<Partner, "id">) => void | Promise<void>;
}

type LocalizedName = Record<LangKey, string>;

const EMPTY_NAMES: LocalizedName = { ua: "", de: "", en: "" };

const LANGUAGES: Array<{ key: LangKey; label: string }> = [
  { key: "ua", label: "UA" },
  { key: "de", label: "DE" },
  { key: "en", label: "EN" },
];

const TEXT = {
  ua: {
    admin: "Berehynja Admin",
    title: "Додати партнера",
    close: "Закрити",
    logo: "Логотип партнера",
    required: "обов’язково",
    uploadLogo: "Завантажити логотип",
    replaceLogo: "Замінити",
    removeLogo: "Прибрати",
    uploading: "Завантаження...",
    language: "Мова заповнення",
    name: "Назва партнера",
    namePlaceholder: "Введіть назву партнера",
    website: "Посилання на сайт",
    websitePlaceholder: "https://example.com",
    websiteHint:
      "Необов’язкове поле. Використовуйте повне посилання з https://",
    invalidWebsite: "Введіть коректне посилання, яке починається з https://",
    cancel: "Скасувати",
    save: "Зберегти партнера",
    saving: "Збереження...",
    uploaded: "Логотип завантажено.",
    uploadError: "Не вдалося завантажити логотип.",
    validation: "Додайте логотип і введіть назву партнера українською.",
    success: "Партнера додано.",
    saveError: "Не вдалося зберегти партнера.",
  },
  de: {
    admin: "Berehynja Admin",
    title: "Partner hinzufügen",
    close: "Schließen",
    logo: "Partnerlogo",
    required: "erforderlich",
    uploadLogo: "Logo hochladen",
    replaceLogo: "Ersetzen",
    removeLogo: "Entfernen",
    uploading: "Wird hochgeladen...",
    language: "Eingabesprache",
    name: "Name des Partners",
    namePlaceholder: "Namen des Partners eingeben",
    website: "Website-Link",
    websitePlaceholder: "https://example.com",
    websiteHint:
      "Optional. Verwenden Sie einen vollständigen Link mit https://",
    invalidWebsite:
      "Geben Sie einen gültigen Link ein, der mit https:// beginnt.",
    cancel: "Abbrechen",
    save: "Partner speichern",
    saving: "Wird gespeichert...",
    uploaded: "Das Logo wurde hochgeladen.",
    uploadError: "Das Logo konnte nicht hochgeladen werden.",
    validation:
      "Laden Sie ein Logo hoch und geben Sie den ukrainischen Namen ein.",
    success: "Der Partner wurde hinzugefügt.",
    saveError: "Der Partner konnte nicht gespeichert werden.",
  },
  en: {
    admin: "Berehynja Admin",
    title: "Add partner",
    close: "Close",
    logo: "Partner logo",
    required: "required",
    uploadLogo: "Upload logo",
    replaceLogo: "Replace",
    removeLogo: "Remove",
    uploading: "Uploading...",
    language: "Content language",
    name: "Partner name",
    namePlaceholder: "Enter the partner name",
    website: "Website link",
    websitePlaceholder: "https://example.com",
    websiteHint: "Optional. Use a complete link beginning with https://",
    invalidWebsite: "Enter a valid link beginning with https://",
    cancel: "Cancel",
    save: "Save partner",
    saving: "Saving...",
    uploaded: "The logo has been uploaded.",
    uploadError: "The logo could not be uploaded.",
    validation: "Upload a logo and enter the Ukrainian partner name.",
    success: "The partner has been added.",
    saveError: "The partner could not be saved.",
  },
} as const;

const isValidWebsite = (value: string) => {
  if (!value.trim()) return true;

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && Boolean(url.hostname);
  } catch {
    return false;
  }
};

export const AddPartnerModal = ({
  isOpen,
  onClose,
  onSave,
}: AddPartnerModalProps) => {
  const { i18n } = useTranslation();
  const modalTitleId = useId();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language)
    .split("-")[0]
    .toLowerCase();
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";
  const text = TEXT[currentLang];

  const [names, setNames] = useState<LocalizedName>({ ...EMPTY_NAMES });
  const [link, setLink] = useState("");
  const [logo, setLogo] = useState("");
  const [editLang, setEditLang] = useState<LangKey>("ua");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLinkError, setShowLinkError] = useState(false);

  const isBusy = isUploading || isSaving;

  const resetForm = useCallback(() => {
    setNames({ ...EMPTY_NAMES });
    setLink("");
    setLogo("");
    setEditLang("ua");
    setShowLinkError(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleClose = useCallback(() => {
    if (isBusy) return;
    resetForm();
    onClose();
  }, [isBusy, onClose, resetForm]);

  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen, resetForm]);

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

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(text.uploadError);
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const folderName =
        names.ua.trim() || names[editLang].trim() || "partner_logo";
      const result = await uploadMedia(file, "partners", folderName);
      setLogo(result.url);
      toast.success(text.uploaded);
    } catch (error) {
      console.error("Partner logo upload error:", error);
      toast.error(text.uploadError);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleLinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value);
    if (showLinkError) setShowLinkError(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    if (!names.ua.trim() || !logo) {
      setEditLang("ua");
      toast.error(text.validation);
      return;
    }

    if (!isValidWebsite(link)) {
      setShowLinkError(true);
      toast.error(text.invalidWebsite);
      return;
    }

    setIsSaving(true);

    try {
      await onSave({
        name: {
          ua: names.ua.trim(),
          de: names.de.trim(),
          en: names.en.trim(),
        },
        logo,
        link: link.trim() || undefined,
      });

      toast.success(text.success);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Partner save error:", error);
      toast.error(text.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const linkIsValid = isValidWebsite(link);
  const canSubmit = Boolean(names.ua.trim() && logo && linkIsValid);

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
        aria-labelledby={modalTitleId}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.35)]"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 md:px-7">
          <div>
            <p className="mb-1 text-[11px] font-black tracking-[0.2em] text-blue-600 uppercase">
              {text.admin}
            </p>
            <h2
              id={modalTitleId}
              className="truncate text-xl font-semibold tracking-tight text-slate-950 md:text-2xl"
            >
              {text.title}
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

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="space-y-7 px-5 py-6 md:px-7 md:py-7">
            <section>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-extrabold text-slate-800">
                    {text.logo}
                  </h3>
                  <span className="text-xs font-bold text-blue-600">
                    {text.required}
                  </span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={isUploading}
                className="sr-only"
              />

              {logo ? (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                  <div className="flex min-h-48 items-center justify-center p-7">
                    <img
                      src={logo}
                      alt=""
                      className="max-h-36 max-w-full object-contain"
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
                      {isUploading ? text.uploading : text.replaceLogo}
                    </button>

                    <button
                      type="button"
                      onClick={() => setLogo("")}
                      disabled={isUploading}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      {text.removeLogo}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex min-h-48 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70"
                >
                  <span className="mb-3 flex size-13 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                    {isUploading ? (
                      <Loader2 size={25} className="animate-spin" />
                    ) : (
                      <ImageIcon size={25} />
                    )}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {isUploading ? text.uploading : text.uploadLogo}
                  </span>
                </button>
              )}
            </section>

            <section aria-labelledby={`${modalTitleId}-language`}>
              <p
                id={`${modalTitleId}-language`}
                className="mb-3 text-xs font-black tracking-[0.15em] text-slate-500 uppercase"
              >
                {text.language}
              </p>

              <div
                role="tablist"
                aria-label={text.language}
                className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1.5"
              >
                {LANGUAGES.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={editLang === key}
                    onClick={() => setEditLang(key)}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-extrabold transition ${
                      editLang === key
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {label}
                    {names[key].trim() && (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold text-slate-800">
                {text.name} ({editLang.toUpperCase()})
                {editLang === "ua" && (
                  <span className="ml-2 text-xs text-blue-600">
                    {text.required}
                  </span>
                )}
              </span>
              <input
                type="text"
                value={names[editLang]}
                onChange={(event) =>
                  setNames((previous) => ({
                    ...previous,
                    [editLang]: event.target.value,
                  }))
                }
                placeholder={text.namePlaceholder}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold text-slate-800">
                {text.website}
              </span>

              <span className="relative block">
                <Link2
                  size={19}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="url"
                  inputMode="url"
                  value={link}
                  onChange={handleLinkChange}
                  onBlur={() => setShowLinkError(!isValidWebsite(link))}
                  placeholder={text.websitePlaceholder}
                  aria-invalid={showLinkError}
                  aria-describedby={`${modalTitleId}-link-hint`}
                  className={`w-full rounded-2xl border bg-slate-50 py-3.5 pr-4 pl-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                    showLinkError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                  }`}
                />
              </span>

              <span
                id={`${modalTitleId}-link-hint`}
                className={`mt-2 block text-xs leading-5 ${
                  showLinkError ? "font-bold text-red-600" : "text-slate-500"
                }`}
              >
                {showLinkError ? text.invalidWebsite : text.websiteHint}
              </span>
            </label>
          </div>

          <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:justify-end md:px-7">
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
              disabled={isBusy || !canSubmit}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            >
              {isSaving || isUploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {isSaving
                ? text.saving
                : isUploading
                  ? text.uploading
                  : text.save}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};
