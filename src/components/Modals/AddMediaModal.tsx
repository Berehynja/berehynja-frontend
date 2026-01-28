import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (url: string) => Promise<void>;
  title: string;
  type: "image" | "video";
}

export const AddMediaModal = ({ isOpen, onClose, onUpload, type, title }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      // 1. Загружаем в Cloudinary
      const url = await uploadToCloudinary(file);
      // 2. Сохраняем ссылку в Firebase (через пропс)
      await onUpload(url);

      setFile(null);
      onClose();
    } catch (error) {
      alert("Ошибка при загрузке! :" + error);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_preset_name"); // Замени на свой пресет

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, // Замени на свой cloud_name
      { method: "POST", body: formData }
    );

    const data = await response.json();
    return data.secure_url; // Возвращает прямую ссылку https://...
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">{title}</h2>

        <input
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          onChange={handleFileChange}
          className="mb-4 w-full cursor-pointer rounded border p-2 text-sm"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-gray-500 hover:bg-gray-100"
            disabled={isUploading}
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? "Завантаження..." : `Зберегти ${type === "image" ? "фото" : "відео"}`}
          </button>
        </div>
      </div>
    </div>
  );
};
