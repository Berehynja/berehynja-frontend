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
  const { t } = useTranslation();
  const tr = (key: string) => t(`admin.partnerModal.${key}`);
  const modalTitleId = useId();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);


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
      toast.error(tr("uploadError"));
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const folderName =
        names.ua.trim() || names[editLang].trim() || "partner_logo";
      const result = await uploadMedia(file, "partners", folderName);
      setLogo(result.url);
      toast.success(tr("uploaded"));
    } catch (error) {
      console.error("Partner logo upload error:", error);
      toast.error(tr("uploadError"));
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
      toast.error(tr("validation"));
      return;
    }

    if (!isValidWebsite(link)) {
      setShowLinkError(true);
      toast.error(tr("invalidWebsite"));
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

      toast.success(tr("success"));
      resetForm();
      onClose();
    } catch (error) {
      console.error("Partner save error:", error);
      toast.error(tr("saveError"));
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
        aria-label={tr("close")}
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-slate-950/65 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.35)]"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 bg-linear-to-br from-blue-600 to-blue-900 px-5 py-5 text-white md:px-7 md:py-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-yellow-300 shadow-inner backdrop-blur-md">
              <ImageIcon size={24} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-blue-100 uppercase">
                {tr("admin")}
              </p>
              <h2
                id={modalTitleId}
                className="truncate text-xl font-semibold tracking-tight text-white md:text-2xl"
              >
                {tr("title")}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            aria-label={tr("close")}
            title={tr("close")}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/15 bg-black/10 text-white shadow-sm backdrop-blur-md transition hover:bg-black/20 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X size={21} aria-hidden="true" />
          </button>
        </header>

        <form
          id="partner-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto bg-slate-50/60"
        >
          <div className="space-y-7 px-5 py-6 md:px-7 md:py-7">
            <section>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {tr("logo")}
                  </h3>
                  <span className="text-xs font-bold text-blue-600">
                    {tr("required")}
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
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
                    >
                      {isUploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {isUploading ? tr("uploading") : tr("replaceLogo")}
                    </button>

                    <button
                      type="button"
                      onClick={() => setLogo("")}
                      disabled={isUploading}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      {tr("removeLogo")}
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
                  <span className="text-sm font-semibold text-slate-900">
                    {isUploading ? tr("uploading") : tr("uploadLogo")}
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
                    aria-selected={editLang === key}
                    onClick={() => setEditLang(key)}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
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
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                {tr("name")} ({editLang.toUpperCase()})
                {editLang === "ua" && (
                  <span className="ml-2 text-xs text-blue-600">
                    {tr("required")}
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
                placeholder={tr("namePlaceholder")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                {tr("website")}
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
                  placeholder={tr("websitePlaceholder")}
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
                {showLinkError ? tr("invalidWebsite") : tr("websiteHint")}
              </span>
            </label>
          </div>

        </form>

        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:justify-end md:px-7">
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
              form="partner-form"
              disabled={isBusy || !canSubmit}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            >
              {isSaving || isUploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {isSaving
                ? tr("saving")
                : isUploading
                  ? tr("uploading")
                  : tr("save")}
            </button>
        </footer>
      </div>
    </div>
  );
};
