import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="font-nunito fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Червоний фон для уваги */}
        <div className="flex items-center gap-4 border-b border-red-100 bg-red-50 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Footer: Кнопки */}
        <div className="flex justify-evenly gap-3 bg-gray-50 p-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer rounded-xl px-4 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
          >
            Скасувати
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="cursor-pointer rounded-xl bg-red-500 px-4 py-2 font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 hover:shadow-red-300 disabled:cursor-wait disabled:opacity-50"
          >
            {isLoading ? "Видалення..." : "Так, видалити"}
          </button>
        </div>
      </div>
    </div>
  );
}
