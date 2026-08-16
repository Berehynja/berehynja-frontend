import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { doc, updateDoc } from "firebase/firestore";
import {
  Check,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { db } from "../../firebase";
import {
  uploadMedia,
  type MediaCategory,
} from "../../services/cloudinaryService";
import type { LangKey } from "../../types/types";

type MultilingualText = Record<LangKey, string>;
type FieldLabel = string | Partial<Record<LangKey, string>>;

export interface FieldConfig {
  key: string;
  label: FieldLabel;
  type: "input" | "textarea" | "image";
  mediaCategory?: MediaCategory;
  required?: boolean;
  placeholder?: FieldLabel;
}

interface EditTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  sectionName: string;
  modalTitle?: string | Partial<Record<LangKey, string>>;
  initialData?: Record<string, unknown> | null;
  fields: FieldConfig[];
}

const LANGUAGES: Array<{ key: LangKey; label: string }> = [
  { key: "ua", label: "UA" },
  { key: "de", label: "DE" },
  { key: "en", label: "EN" },
];

const MAX_IMAGE_SIZE = 12 * 1024 * 1024;

const EMPTY_TEXT: MultilingualText = { ua: "", de: "", en: "" };

const getNestedValue = (
  object: Record<string, unknown> | null | undefined,
  path: string,
): unknown => {
  if (!object) return undefined;

  return path.split(".").reduce<unknown>((currentValue, pathPart) => {
    if (
      currentValue &&
      typeof currentValue === "object" &&
      pathPart in currentValue
    ) {
      return (currentValue as Record<string, unknown>)[pathPart];
    }

    return undefined;
  }, object);
};

const normalizeMultilingualText = (value: unknown): MultilingualText => {
  if (typeof value === "string") {
    return { ...EMPTY_TEXT, ua: value };
  }

  if (value && typeof value === "object") {
    const localizedValue = value as Partial<MultilingualText>;

    return {
      ua: localizedValue.ua ?? "",
      de: localizedValue.de ?? "",
      en: localizedValue.en ?? "",
    };
  }

  return { ...EMPTY_TEXT };
};

const resolveLocalizedLabel = (
  value: FieldLabel | undefined,
  language: LangKey,
  fallback = "",
) => {
  if (!value) return fallback;
  if (typeof value === "string") return value;

  return value[language] || value.ua || value.de || value.en || fallback;
};

export const EditTextModal = ({
  isOpen,
  onClose,
  documentName,
  sectionName,
  modalTitle,
  initialData,
  fields,
}: EditTextModalProps) => {
  const { t, i18n } = useTranslation();
  const tr = (key: string) => t(`common.editTextModal.${key}`);
  const modalTitleId = useId();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language)
    .split("-")[0]
    .toLowerCase();
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  const [activeLang, setActiveLang] = useState<LangKey>("ua");
  const [formData, setFormData] = useState<Record<string, MultilingualText>>(
    {},
  );
  const [imageData, setImageData] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  const hasActiveUpload = Object.values(isUploading).some(Boolean);
  const isBusy = isSaving || hasActiveUpload;

  const initializeForm = useCallback(() => {
    const nextTextData: Record<string, MultilingualText> = {};
    const nextImageData: Record<string, string> = {};

    fields.forEach((field) => {
      const initialValue = getNestedValue(initialData, field.key);

      if (field.type === "image") {
        nextImageData[field.key] =
          typeof initialValue === "string" ? initialValue : "";
      } else {
        nextTextData[field.key] = normalizeMultilingualText(initialValue);
      }
    });

    setFormData(nextTextData);
    setImageData(nextImageData);
    setIsUploading({});
    setActiveLang("ua");
  }, [fields, initialData]);

  const handleClose = useCallback(() => {
    if (isBusy) return;
    onClose();
  }, [isBusy, onClose]);

  useEffect(() => {
    if (isOpen) initializeForm();
  }, [initializeForm, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isBusy) onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isBusy, isOpen, onClose]);

  const handleTextChange = (fieldKey: string, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [fieldKey]: {
        ...(previous[fieldKey] ?? EMPTY_TEXT),
        [activeLang]: value,
      },
    }));
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    category: MediaCategory = "banners",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    setIsUploading((previous) => ({ ...previous, [fieldKey]: true }));

    try {
      const folderName = `${documentName}-${sectionName}`;
      const response = await uploadMedia(file, category, folderName);

      setImageData((previous) => ({
        ...previous,
        [fieldKey]: response.url,
      }));
      toast.success(tr("uploadSuccess"));
    } catch (error) {
      console.error("Section image upload error:", error);
      toast.error(tr("uploadError"));
    } finally {
      setIsUploading((previous) => ({ ...previous, [fieldKey]: false }));
      event.target.value = "";
    }
  };

  const isLanguageComplete = (language: LangKey) => {
    return fields
      .filter((field) => field.type !== "image" && field.required !== false)
      .every((field) => formData[field.key]?.[language]?.trim());
  };

  const findFirstIncompleteLanguage = (): LangKey | null => {
    return LANGUAGES.find(({ key }) => !isLanguageComplete(key))?.key ?? null;
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    const incompleteLanguage = findFirstIncompleteLanguage();

    if (incompleteLanguage) {
      setActiveLang(incompleteLanguage);
      toast.error(tr("requiredError"));
      return;
    }

    setIsSaving(true);

    try {
      const documentReference = doc(db, "pages", documentName);
      const updatePayload: Record<string, string> = {};

      fields.forEach((field) => {
        if (field.type === "image") {
          updatePayload[`${sectionName}.${field.key}`] =
            imageData[field.key] ?? "";
          return;
        }

        const fieldValue = formData[field.key] ?? EMPTY_TEXT;

        LANGUAGES.forEach(({ key }) => {
          updatePayload[`${sectionName}.${field.key}.${key}`] =
            fieldValue[key].trim();
        });
      });

      await updateDoc(documentReference, updatePayload);
      toast.success(tr("saved"));
      onClose();
    } catch (error) {
      console.error("Section save error:", error);
      toast.error(tr("saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const resolvedModalTitle = modalTitle
    ? resolveLocalizedLabel(modalTitle, currentLang, tr("defaultTitle"))
    : tr("defaultTitle");
  const hasTextFields = fields.some((field) => field.type !== "image");

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
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.35)]"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 bg-linear-to-br from-blue-600 to-blue-900 px-5 py-5 text-white md:px-8 md:py-6">
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
                {resolvedModalTitle}
              </h2>
              <p className="mt-1 truncate text-sm font-medium text-blue-100">
                {documentName} / {sectionName}
              </p>
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
          id="edit-section-form"
          onSubmit={handleSave}
          className="overflow-y-auto bg-slate-50/60 px-5 py-6 md:px-8 md:py-7"
        >
          <div className="space-y-7">
            {hasTextFields && (
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
                      {isLanguageComplete(key) && (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {fields.map((field) => {
              const fieldLabel = resolveLocalizedLabel(
                field.label,
                currentLang,
                field.key,
              );

              if (field.type === "image") {
                const inputId = `${modalTitleId}-${field.key}`;
                const fieldIsUploading = Boolean(isUploading[field.key]);
                const imageUrl = imageData[field.key] ?? "";

                return (
                  <section key={field.key}>
                    <div className="mb-3 flex flex-wrap items-baseline gap-2">
                      <h3 className="text-sm font-semibold text-slate-800">
                        {fieldLabel}
                      </h3>
                      <span className="text-xs font-bold text-blue-600">
                        {tr("sharedImage")}
                      </span>
                    </div>

                    <input
                      ref={(element) => {
                        fileInputRefs.current[field.key] = element;
                      }}
                      id={inputId}
                      type="file"
                      accept="image/*"
                      disabled={fieldIsUploading}
                      onChange={(event) =>
                        handleImageUpload(event, field.key, field.mediaCategory)
                      }
                      className="sr-only"
                    />

                    {imageUrl ? (
                      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                        <div className="flex max-h-80 min-h-48 items-center justify-center overflow-hidden">
                          <img
                            src={imageUrl}
                            alt=""
                            className="max-h-80 w-full object-contain"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white p-3">
                          <button
                            type="button"
                            onClick={() =>
                              fileInputRefs.current[field.key]?.click()
                            }
                            disabled={fieldIsUploading}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
                          >
                            {fieldIsUploading ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <UploadCloud size={16} />
                            )}
                            {fieldIsUploading
                              ? tr("uploading")
                              : tr("replaceImage")}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setImageData((previous) => ({
                                ...previous,
                                [field.key]: "",
                              }))
                            }
                            disabled={fieldIsUploading}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Trash2 size={16} />
                            {tr("removeImage")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRefs.current[field.key]?.click()
                        }
                        disabled={fieldIsUploading}
                        className="flex min-h-48 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70"
                      >
                        <span className="mb-3 flex size-13 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                          {fieldIsUploading ? (
                            <Loader2 size={25} className="animate-spin" />
                          ) : (
                            <ImageIcon size={25} />
                          )}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {fieldIsUploading ? tr("uploading") : tr("uploadImage")}
                        </span>
                      </button>
                    )}
                  </section>
                );
              }

              const placeholder = resolveLocalizedLabel(
                field.placeholder,
                currentLang,
              );
              const isRequired = field.required !== false;

              return (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    {fieldLabel} ({activeLang.toUpperCase()})
                    {isRequired && (
                      <span className="ml-2 text-xs text-blue-600">
                        {tr("required")}
                      </span>
                    )}
                  </span>

                  {field.type === "input" ? (
                    <input
                      type="text"
                      value={formData[field.key]?.[activeLang] ?? ""}
                      onChange={(event) =>
                        handleTextChange(field.key, event.target.value)
                      }
                      placeholder={placeholder}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  ) : (
                    <textarea
                      rows={4}
                      value={formData[field.key]?.[activeLang] ?? ""}
                      onChange={(event) =>
                        handleTextChange(field.key, event.target.value)
                      }
                      placeholder={placeholder}
                      className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  )}
                </label>
              );
            })}
          </div>
        </form>

        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:justify-end md:px-8">
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
            form="edit-section-form"
            disabled={isBusy}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
          >
            {isSaving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Check size={18} />
            )}
            {isSaving ? tr("saving") : tr("save")}
          </button>
        </footer>
      </div>
    </div>
  );
};
