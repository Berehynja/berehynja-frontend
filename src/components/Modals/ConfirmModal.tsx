import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";


interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  isLoading?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  loadingLabel?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  cancelLabel,
  confirmLabel,
  loadingLabel,
}: ConfirmModalProps) {
  const { t } = useTranslation();
  const tr = (key: string) => t(`common.confirmModal.${key}`);
  const titleId = useId();
  const messageId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const isBusyRef = useRef(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const isBusy = isLoading || isConfirming;
  isBusyRef.current = isBusy;

  useEffect(() => {
    if (!isOpen) {
      setIsConfirming(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isBusyRef.current) onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isBusy) onClose();
  };

  const handleConfirm = async () => {
    if (isBusy) return;

    setIsConfirming(true);

    try {
      await onConfirm();
    } catch (error) {
      console.error("Confirmation action error:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onMouseDown={handleBackdropClick}
      className="font-nunito fixed inset-0 z-10000 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="w-full max-w-md overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.4)]"
      >
        <header className="flex items-start gap-4 border-b border-red-100 bg-red-50/80 px-5 py-5 md:px-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm ring-1 ring-red-100">
            <AlertTriangle size={23} />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h2
              id={titleId}
              className="text-lg font-semibold text-slate-950 md:text-xl"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            aria-label={tr("close")}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-red-100 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </header>

        <div className="px-5 py-6 md:px-6">
          <p
            id={messageId}
            className="text-sm leading-6 text-slate-600 md:text-base"
          >
            {message}
          </p>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:justify-end md:px-6">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel ?? tr("cancel")}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isBusy}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60 disabled:shadow-none"
          >
            {isBusy ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            {isBusy
              ? (loadingLabel ?? tr("loading"))
              : (confirmLabel ?? tr("confirm"))}
          </button>
        </footer>
      </div>
    </div>
  );
}
