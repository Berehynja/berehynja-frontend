import { useState, useEffect, useMemo } from 'react';

type EventFormData = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageBanner: string;
  images: string[];
  videos: string[];
};

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => void;
  editingEvent?: EventFormData | null;
};

export const AddEventModal = ({ isOpen, onClose, onSave, editingEvent }: AddEventModalProps) => {
  // Начальное состояние для пустой формы
  const initialFormState = useMemo<EventFormData>(() => ({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    imageBanner: "",
    images: [],
    videos: [],
  }), []);

  const [formData, setFormData] = useState<EventFormData>(initialFormState);

  // Когда модалка открывается или меняется выбранное событие (editingEvent)
  useEffect(() => {
    if (editingEvent) {
      // Если передали событие — заполняем форму его данными
      setFormData(editingEvent);
    } else {
      // Если события нет — сбрасываем в пустую форму
      setFormData(initialFormState);
    }
  }, [editingEvent, isOpen, initialFormState]);

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
      <div className="w-full max-w-2xl h-150 bg-white rounded-lg p-6" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{editingEvent ? "Редагувати подію" : "Додати нову подію"}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="field">
            <label>Назва заходу</label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="Наприклад: Святкування..."
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label>Дата</label>
              <input 
                name="date" 
                type="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="field">
              <label>Час</label>
              <input 
                name="time" 
                placeholder="14:00 - 20:00" 
                value={formData.time} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="field">
            <label>Локація</label>
            <input 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              placeholder="Berlin Community Center"
            />
          </div>

          <div className="field">
            <label>Опис</label>
            <textarea 
              name="description" 
              rows={4} 
              value={formData.description} 
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>URL головного баннера</label>
            <input 
              name="imageBanner" 
              value={formData.imageBanner} 
              onChange={handleChange} 
              placeholder="Посилання на фото з Pexels/Cloudinary"
            />
          </div>

          {editingEvent && (
            <p className="media-note">
              📷 Фото та відео ({formData.images.length + formData.videos.length}) редагуються в окремому вікні.
            </p>
          )}

          <footer className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Скасувати</button>
            <button type="submit" className="btn-primary">
              {editingEvent ? "Зберегти зміни" : "Створити"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};


