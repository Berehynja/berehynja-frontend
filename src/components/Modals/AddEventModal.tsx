import { useState, useEffect, useMemo } from 'react';
import type { Event } from "../../types/event";
// Импортируем твой сервис загрузки
import { uploadMedia } from '../../services/cloudinaryService';

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Event) => void;
  eventToEdit?: Event | null;
  onDelete?: (eventId: string) => void;
};

export const AddEventModal = ({ isOpen, onClose, onSave, onDelete, eventToEdit }: AddEventModalProps) => {
  const initialFormState = useMemo<Event>(() => ({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    imageBanner: "", // Здесь будет храниться URL из Cloudinary
    images: [],
    videos: [],
  }), []);

  const [formData, setFormData] = useState<Event>(initialFormState);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setFormData(eventToEdit);
    } else {
      setFormData(initialFormState);
    }
  }, [eventToEdit, isOpen, initialFormState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- ФУНКЦИЯ ЗАГРУЗКИ БАННЕРА ---
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Используем название события как имя папки, если оно введено, иначе просто 'banners'
    const folderName = formData.title || 'banners';

    setIsUploading(true);
    try {
      // Загружаем через твой сервис
      // Рекомендую в Cloudinary для баннеров создать отдельный пресет 'banner_photos'
      const result = await uploadMedia(file, 'banners', folderName);
      
      // Обновляем состояние формы полученным URL
      setFormData(prev => ({ ...prev, imageBanner: result.url }));
    } catch (error) {
      alert("Помилка завантаження баннера: " + error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="font-nunito fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{eventToEdit ? "Редагувати подію" : "Додати нову подію"}</h2>
          <button className="text-2xl" onClick={onClose}>&times;</button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Назва */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Назва заходу</label>
            <input className='border border-gray-300 rounded px-3 py-2'
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="Наприклад: Святкування..."
            />
          </div>

          {/* Дата и Время */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Дата</label>
              <input className='border border-gray-300 rounded px-3 py-2'
                name="date" type="date" value={formData.date} onChange={handleChange} required 
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Час</label>
              <input className='border border-gray-300 rounded px-3 py-2'
                name="time" placeholder="14:00 - 20:00" value={formData.time} onChange={handleChange} 
              />
            </div>
          </div>

          {/* Локация */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Локація</label>
            <input className='border border-gray-300 rounded px-3 py-2'
              name="location" value={formData.location} onChange={handleChange} placeholder="Berlin Community Center"
            />
          </div>

          {/* --- СЕКЦИЯ БАННЕРА --- */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Головний баннер</label>
            
            {/* Превью баннера */}
            {formData.imageBanner && (
              <div className="relative w-full h-40 mb-2 overflow-hidden rounded-lg border">
                <img 
                  src={formData.imageBanner} 
                  alt="Banner Preview" 
                  className="w-full h-full object-cover"
                />
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imageBanner: "" }))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs px-2"
                >
                  Видалити
                </button>
              </div>
            )}

            <div className="flex items-center gap-4">
              <label className={`cursor-pointer px-4 py-2 rounded border-2 border-dashed transition-all ${isUploading ? 'bg-gray-100' : 'hover:border-blue-400'}`}>
                {isUploading ? "Завантаження..." : formData.imageBanner ? "Змінити фото" : "Обрати фото баннера"}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleBannerUpload} 
                  className="hidden" 
                  disabled={isUploading}
                />
              </label>
              {isUploading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>}
            </div>
          </div>

          {/* Опис */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Опис</label>
            <textarea className='border border-gray-300 rounded px-3 py-2'
              name="description" rows={3} value={formData.description} onChange={handleChange}
            />
          </div>

          <footer className="flex justify-center gap-4 mt-6">
            {eventToEdit && (
              <button type="button" className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50" onClick={() => onDelete?.(eventToEdit.id!)}>
                Видалити
              </button>
            )}
            <button type="button" className="px-4 py-2 border rounded hover:bg-gray-50" onClick={onClose}>
              Скасувати
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isUploading}
            >
              {eventToEdit ? "Зберегти зміни" : "Створити"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};


