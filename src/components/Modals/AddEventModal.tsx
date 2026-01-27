import { useState, useEffect, useMemo } from 'react';
import type { Event } from "../../types/event";

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Event) => void;
  eventToEdit?: Event| null;
  onDelete?: (eventId: string) => void;
};

export const AddEventModal = ({ isOpen, onClose, onSave, onDelete, eventToEdit }: AddEventModalProps) => {
  console.log("🚀 ~ eventToEdit:", eventToEdit)
  // Начальное состояние для пустой формы
  const initialFormState = useMemo<Event>(() => ({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    imageBanner: "",
    images: [],
    videos: [],
  }), []);

  const [formData, setFormData] = useState<Event>(initialFormState);

  // Когда модалка открывается или меняется выбранное событие (eventToEdit)
  useEffect(() => {
    if (eventToEdit) {
      // Если передали событие — заполняем форму его данными
      setFormData(eventToEdit);
    } else {
      // Если события нет — сбрасываем в пустую форму
      setFormData(initialFormState);
    }
  }, [eventToEdit, isOpen, initialFormState]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData); // Передаем данные наверх для записи в базу
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="font-nunito fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}>
      <div className="w-full max-w-2xl h-170 bg-white rounded-lg p-6" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between mb-4">
          <h2>{eventToEdit ? "Редагувати подію" : "Додати нову подію"}</h2>
          <button className=" w-5 h-5" onClick={onClose}>&times;</button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label>Назва заходу</label>
            <input className='border border-gray-300 rounded px-3 py-2'
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="Наприклад: Святкування..."
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label className="mb-2">Дата</label>
              <input 
                className='border border-gray-300 rounded px-3 py-2'
                name="date" 
                type="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="flex flex-col">
              <label>Час</label>
              <input className='border border-gray-300 rounded px-3 py-2'
                name="time" 
                placeholder="14:00 - 20:00" 
                value={formData.time} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label>Локація</label>
            <input className='border border-gray-300 rounded px-3 py-2'
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              placeholder="Berlin Community Center"
            />
          </div>

          <div className="flex flex-col">
            <label>URL головного баннера</label>
            <input className='border border-gray-300 rounded px-3 py-2'
              name="imageBanner" 
              value={formData.imageBanner} 
              onChange={handleChange} 
              placeholder="Посилання на фото з Pexels/Cloudinary"
            />
          </div>

          <div className="flex flex-col">
            <label>Опис</label>
            <textarea className='border border-gray-300 rounded px-3 py-2'
              name="description" 
              rows={4} 
              value={formData.description} 
              onChange={handleChange}
            />
          </div>

          

          {/* {eventToEdit && (
            <p className="media-note">
              📷 Фото та відео ({formData.images.length + formData.videos.length}) редагуються в окремому вікні.
            </p>
          )} */}

          <footer className=" flex justify-center gap-4 mt-6">
            {eventToEdit && <button type="button" className="btn-secondary" onClick={() => { onDelete?.(eventToEdit.id!) }}>Видалити</button>}
            <button type="button" className="btn-secondary" onClick={onClose}>Скасувати</button>
            <button type="submit" className="btn-primary">
              {eventToEdit ? "Зберегти зміни" : "Створити"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};


