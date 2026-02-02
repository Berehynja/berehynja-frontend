import { useState } from "react";
import { uploadMedia } from "../../services/cloudinaryService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // onUpload принимает ссылку и необязательный id для фото
  onUpload: (url: string, public_id?: string) => Promise<void>;
  title: string; // Это и заголовок модалки, и имя папки
  type: "image" | "video";
  subFolder?: string; // Дополнительная папка внутри категории (например, название события)
}

export const AddMediaModal = ({ isOpen, onClose, onUpload, type, title, subFolder }: Props) => {
  const [fileImg, setFileImg] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      if (type === "image") {
        // --- ФОТО ---
        if (!fileImg) return;
        
        // Передаем категорию 'events' и название события (title) как subFolder
        const result = await uploadMedia(fileImg, 'events', subFolder);
        
        await onUpload(result.url, result.public_id);
      } else {
        // --- ВИДЕО (YouTube) ---
        if (!videoUrl) return;
        
        // Для видео просто отправляем ссылку в Firebase
        await onUpload(videoUrl);
      }

      // Сброс полей
      setFileImg(null);
      setVideoUrl("");
      onClose();
    } catch (error) {
      console.error("Помилка при завантаженні:", error);
      alert("Не вдалося зберегти дані");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Додати {type === "image" ? "фото" : "відео"} події "{title}"
        </h2>

        {type === "image" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Оберіть файл:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFileImg(e.target.files ? e.target.files[0] : null)}
              className="w-full cursor-pointer rounded-lg border border-gray-300 p-2 text-sm"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Посилання на відео:</label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            Скасувати
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isUploading || (type === "image" ? !fileImg : !videoUrl)}
            className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300 transition-all"
          >
            {isUploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Завантаження...
              </>
            ) : (
              "Зберегти"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
