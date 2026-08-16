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

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (url: string, publicId?: string) => Promise<void>;
  title: string;
  type: "image" | "video";
  subFolder?: string;
}

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
  const { t } = useTranslation();
  const tr = (key: string) => t(`admin.mediaModal.${key}`);
  const modalTitleId = useId();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);


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
      toast.error(tr("invalidImage"));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(tr("imageTooLarge"));
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
      toast.error(tr("invalidImage"));
      return;
    }

    if (type === "video" && !isValidYouTubeUrl(videoUrl)) {
      setShowVideoError(true);
      toast.error(tr("invalidVideo"));
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
        toast.success(tr("successPhoto"));
      } else {
        await onUpload(videoUrl.trim());
        toast.success(tr("successVideo"));
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Media upload error:", error);
      toast.error(tr("error"));
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
              {type === "image" ? (
                <ImagePlus size={24} aria-hidden="true" />
              ) : (
                <Video size={24} aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-blue-100 uppercase">
                {tr("admin")}
              </p>
              <h2
                id={modalTitleId}
                className="truncate text-xl font-semibold tracking-tight text-white md:text-2xl"
              >
                {type === "image" ? tr("addPhoto") : tr("addVideo")}
              </h2>
              <p className="mt-1 truncate text-sm text-blue-100">
                {tr("forEvent")}:{" "}
                <span className="font-semibold text-white">{title}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            aria-label={tr("close")}
            title={tr("close")}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/15 bg-black/10 text-white shadow-sm backdrop-blur-md transition hover:bg-black/20 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X size={21} aria-hidden="true" />
          </button>
        </header>

        <form
          id="media-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto bg-slate-50/60"
        >
          <div className="px-5 py-6 md:px-7 md:py-7">
            {type === "image" ? (
              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <label
                    htmlFor={fileInputId}
                    className="text-sm font-semibold text-slate-800"
                  >
                    {tr("photoLabel")}
                  </label>
                  <span className="text-right text-xs text-slate-500">
                    {tr("photoHint")}
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
                    <div className="aspect-[4/3] max-h-80 overflow-hidden">
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
                        className="shrink-0 cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {tr("replacePhoto")}
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
                    <span className="text-sm font-semibold text-slate-900">
                      {tr("choosePhoto")}
                    </span>
                    <span className="mt-2 text-xs text-slate-500">
                      {tr("photoHint")}
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  {tr("videoLabel")}
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
                    placeholder={tr("videoPlaceholder")}
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
                  {showVideoError ? tr("invalidVideo") : tr("videoHint")}
                </span>

                <span className="mt-6 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-blue-700">
                  <Video size={21} className="shrink-0" />
                  <span className="text-sm font-bold">YouTube</span>
                </span>
              </label>
            )}
          </div>

        </form>

        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:justify-end md:px-7">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tr("cancel")}
            </button>

            <button
              type="submit"
              form="media-form"
              disabled={isUploading || !canSubmit}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            >
              {isUploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              {isUploading
                ? type === "image"
                  ? tr("uploading")
                  : tr("saving")
                : type === "image"
                  ? tr("savePhoto")
                  : tr("saveVideo")}
            </button>
        </footer>
      </div>
    </div>
  );
};
