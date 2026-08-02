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
  CheckCircle2,
  ImagePlus,
  Link2,
  Loader2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { uploadMedia } from "../../services/cloudinaryService";
import type { LangKey } from "../../types/types";

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (url: string, publicId?: string) => Promise<void>;
  title: string;
  type: "image" | "video";
  subFolder?: string;
}

const TEXT = {
  ua: {
    admin: "Berehynja Admin",
    addPhoto: "Додати фотографію",
    addVideo: "Додати відео",
    forEvent: "Для події",
    close: "Закрити",
    photoLabel: "Фотографія",
    photoHint: "JPG, PNG, WEBP або AVIF, до 10 МБ",
    choosePhoto: "Вибрати фотографію",
    replacePhoto: "Замінити фотографію",
    videoLabel: "Посилання на YouTube",
    videoHint: "Вставте повне посилання на відео з YouTube або youtu.be.",
    videoPlaceholder: "https://www.youtube.com/watch?v=...",
    cancel: "Скасувати",
    savePhoto: "Додати фотографію",
    saveVideo: "Додати відео",
    uploading: "Завантаження...",
    saving: "Збереження...",
    invalidImage: "Оберіть коректний файл зображення.",
    imageTooLarge: "Розмір зображення не повинен перевищувати 10 МБ.",
    invalidVideo: "Введіть коректне посилання на YouTube.",
    successPhoto: "Фотографію додано.",
    successVideo: "Відео додано.",
    error: "Не вдалося зберегти медіафайл.",
  },
  de: {
    admin: "Berehynja Admin",
    addPhoto: "Foto hinzufügen",
    addVideo: "Video hinzufügen",
    forEvent: "Für die Veranstaltung",
    close: "Schließen",
    photoLabel: "Foto",
    photoHint: "JPG, PNG, WEBP oder AVIF, bis zu 10 MB",
    choosePhoto: "Foto auswählen",
    replacePhoto: "Foto ersetzen",
    videoLabel: "YouTube-Link",
    videoHint:
      "Fügen Sie den vollständigen Link von YouTube oder youtu.be ein.",
    videoPlaceholder: "https://www.youtube.com/watch?v=...",
    cancel: "Abbrechen",
    savePhoto: "Foto hinzufügen",
    saveVideo: "Video hinzufügen",
    uploading: "Wird hochgeladen...",
    saving: "Wird gespeichert...",
    invalidImage: "Wählen Sie eine gültige Bilddatei aus.",
    imageTooLarge: "Das Bild darf nicht größer als 10 MB sein.",
    invalidVideo: "Geben Sie einen gültigen YouTube-Link ein.",
    successPhoto: "Das Foto wurde hinzugefügt.",
    successVideo: "Das Video wurde hinzugefügt.",
    error: "Die Mediendatei konnte nicht gespeichert werden.",
  },
  en: {
    admin: "Berehynja Admin",
    addPhoto: "Add photo",
    addVideo: "Add video",
    forEvent: "For event",
    close: "Close",
    photoLabel: "Photo",
    photoHint: "JPG, PNG, WEBP or AVIF, up to 10 MB",
    choosePhoto: "Choose photo",
    replacePhoto: "Replace photo",
    videoLabel: "YouTube link",
    videoHint: "Paste the full video link from YouTube or youtu.be.",
    videoPlaceholder: "https://www.youtube.com/watch?v=...",
    cancel: "Cancel",
    savePhoto: "Add photo",
    saveVideo: "Add video",
    uploading: "Uploading...",
    saving: "Saving...",
    invalidImage: "Choose a valid image file.",
    imageTooLarge: "The image must not exceed 10 MB.",
    invalidVideo: "Enter a valid YouTube link.",
    successPhoto: "The photo has been added.",
    successVideo: "The video has been added.",
    error: "The media file could not be saved.",
  },
} as const;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const isValidYouTubeUrl = (value: string) => {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.replace(/^www\./, "");

    return (
      url.protocol === "https:" &&
      (host === "youtube.com" ||
        host.endsWith(".youtube.com") ||
        host === "youtu.be")
    );
  } catch {
    return false;
  }
};

export const AddMediaModal = ({
  isOpen,
  onClose,
  onUpload,
  type,
  title,
  subFolder,
}: AddMediaModalProps) => {
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showVideoError, setShowVideoError] = useState(false);

  const resetForm = useCallback(() => {
    setImageFile(null);
    setVideoUrl("");
    setShowVideoError(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleClose = useCallback(() => {
    if (isUploading) return;
    resetForm();
    onClose();
  }, [isUploading, onClose, resetForm]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isUploading) {
        resetForm();
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isUploading, onClose, resetForm]);

  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen, resetForm, type]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(text.invalidImage);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(text.imageTooLarge);
      event.target.value = "";
      return;
    }

    setImageFile(file);
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
    if (showVideoError) setShowVideoError(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUploading) return;

    if (type === "image" && !imageFile) {
      toast.error(text.invalidImage);
      return;
    }

    if (type === "video" && !isValidYouTubeUrl(videoUrl)) {
      setShowVideoError(true);
      toast.error(text.invalidVideo);
      return;
    }

    setIsUploading(true);

    try {
      if (type === "image" && imageFile) {
        const result = await uploadMedia(
          imageFile,
          "events",
          subFolder || title,
        );
        await onUpload(result.url, result.public_id);
        toast.success(text.successPhoto);
      } else {
        await onUpload(videoUrl.trim());
        toast.success(text.successVideo);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Media upload error:", error);
      toast.error(text.error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const isVideoValid = isValidYouTubeUrl(videoUrl);
  const canSubmit = type === "image" ? Boolean(imageFile) : isVideoValid;

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
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 md:px-7">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-black tracking-[0.2em] text-blue-600 uppercase">
              {text.admin}
            </p>
            <h2
              id={modalTitleId}
              className="truncate text-xl font-semibold tracking-tight text-slate-950 md:text-2xl"
            >
              {type === "image" ? text.addPhoto : text.addVideo}
            </h2>
            <p className="mt-1 truncate text-sm text-slate-500">
              {text.forEvent}:{" "}
              <span className="font-bold text-slate-700">{title}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            aria-label={text.close}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="px-5 py-6 md:px-7 md:py-7">
            {type === "image" ? (
              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <label
                    htmlFor={fileInputId}
                    className="text-sm font-extrabold text-slate-800"
                  >
                    {text.photoLabel}
                  </label>
                  <span className="text-right text-xs text-slate-500">
                    {text.photoHint}
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  id={fileInputId}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="sr-only"
                />

                {imagePreview ? (
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                    <div className="aspect-4/3 max-h-80 overflow-hidden">
                      <img
                        src={imagePreview}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white p-3">
                      <div className="flex min-w-0 items-center gap-2 text-emerald-600">
                        <CheckCircle2 size={18} className="shrink-0" />
                        <span className="truncate text-xs font-bold text-slate-700">
                          {imageFile?.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="shrink-0 cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {text.replacePhoto}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex min-h-56 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                      <ImagePlus size={27} />
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {text.choosePhoto}
                    </span>
                    <span className="mt-2 text-xs text-slate-500">
                      {text.photoHint}
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold text-slate-800">
                  {text.videoLabel}
                </span>

                <span className="relative block">
                  <Link2
                    size={19}
                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="url"
                    inputMode="url"
                    value={videoUrl}
                    onChange={handleVideoChange}
                    onBlur={() =>
                      setShowVideoError(
                        Boolean(videoUrl.trim()) && !isVideoValid,
                      )
                    }
                    placeholder={text.videoPlaceholder}
                    aria-invalid={showVideoError}
                    aria-describedby={`${modalTitleId}-video-hint`}
                    className={`w-full rounded-2xl border bg-slate-50 py-3.5 pr-4 pl-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                      showVideoError
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                  />
                </span>

                <span
                  id={`${modalTitleId}-video-hint`}
                  className={`mt-2 block text-xs leading-5 ${
                    showVideoError ? "font-bold text-red-600" : "text-slate-500"
                  }`}
                >
                  {showVideoError ? text.invalidVideo : text.videoHint}
                </span>

                <span className="mt-6 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-blue-700">
                  <Video size={21} className="shrink-0" />
                  <span className="text-sm font-bold">YouTube</span>
                </span>
              </label>
            )}
          </div>

          <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:justify-end md:px-7">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {text.cancel}
            </button>

            <button
              type="submit"
              disabled={isUploading || !canSubmit}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            >
              {isUploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              {isUploading
                ? type === "image"
                  ? text.uploading
                  : text.saving
                : type === "image"
                  ? text.savePhoto
                  : text.saveVideo}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};
