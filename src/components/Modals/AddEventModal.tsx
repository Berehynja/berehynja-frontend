import { useState, useEffect, useMemo } from 'react';
import type { Event } from "../../types/event";
import { uploadMedia } from '../../services/cloudinaryService';
import { Calendar, Clock, MapPin, CheckCircle2, X, Plus } from 'lucide-react';

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Event) => void;
  eventToEdit?: Event | null;
  onDelete?: (eventId: string) => void;
};

type LangKey = 'ua' | 'de' | 'en';

export const AddEventModal = ({ isOpen, onClose, onSave, onDelete, eventToEdit }: AddEventModalProps) => {
  const [activeLang, setActiveLang] = useState<LangKey>('ua');
  const [isUploading, setIsUploading] = useState(false);

  const initialFormState = useMemo<Event>(() => ({
    titles: { ua: "", de: "", en: "" },
    descriptions: { ua: "", de: "", en: "" },
    date: "",
    time: "",
    location: "",
    imageBanner: "",
    images: [],
    videos: [],
  }), []);

  const [formData, setFormData] = useState<Event>(initialFormState);


  useEffect(() => {
    if (eventToEdit) {
      const normalized: Event = {
        ...initialFormState,
        ...eventToEdit,
        titles: eventToEdit.titles || { 
          ua: (eventToEdit as unknown as { title: string }).title || "", 
          de: "", 
          en: "" 
        },
        descriptions: eventToEdit.descriptions || { 
          ua: (eventToEdit as unknown as { description: string }).description || "", 
          de: "", 
          en: "" 
        }
      };
      setFormData(normalized);
    } else {
      setFormData(initialFormState);
    }
  }, [eventToEdit, isOpen, initialFormState]);

  const handleLangChange = (field: 'titles' | 'descriptions', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [activeLang]: value }
    }));
  };


  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadMedia(file, 'banners', formData.titles.ua || 'event');
      setFormData(prev => ({ ...prev, imageBanner: result.url }));
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const isLangFilled = (lang: LangKey) => formData.titles[lang].length > 2;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Яскравіший та чіткіший */}
        <header className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-montserratBold text-slate-900 uppercase tracking-tight">
              {eventToEdit ? "Редагування події" : "Створення події"}
            </h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Berehynja Admin</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900">
            <X size={24} />
          </button>
        </header>

        <form 
          onSubmit={(e) => { e.preventDefault(); onSave(formData); onClose(); }} 
          className="p-8 flex flex-col gap-6 font-montserratRegular"
        >
          {/* Блок спільних даних - Чіткі межі */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                <Calendar size={14} className="text-blue-600" /> Дата
              </label>
              <input 
                name="date" type="date" value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-sm" 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                <Clock size={14} className="text-purple-600" /> Час
              </label>
              <input 
                name="time" placeholder="12:00 — 18:00" value={formData.time} 
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-sm placeholder:text-slate-400" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                <MapPin size={14} className="text-red-600" /> Локація
              </label>
              <input 
                name="location" placeholder="Berlin, Germany" value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-sm placeholder:text-slate-400" 
              />
            </div>
          </div>

          {/* Перемикач мов - Високий контраст */}
          <div className="space-y-4">
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              {(['ua', 'de', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase transition-all duration-200 ${
                    activeLang === lang 
                      ? 'bg-white shadow text-blue-700' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  {lang}
                  {isLangFilled(lang) && <CheckCircle2 size={14} className="text-green-600" />}
                </button>
              ))}
            </div>

            {/* Поля введення контенту - Максимальна чіткість */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Назва події ({activeLang})</label>
                <input 
                  value={formData.titles[activeLang]} 
                  onChange={(e) => handleLangChange('titles', e.target.value)}
                  placeholder={`Введіть назву мовою ${activeLang.toUpperCase()}...`}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-lg font-montserratBold text-slate-900 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Опис ({activeLang})</label>
                <textarea 
                  rows={4}
                  value={formData.descriptions[activeLang]} 
                  onChange={(e) => handleLangChange('descriptions', e.target.value)}
                  placeholder={`Опишіть подію детальніше...`}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-300 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Завантаження фото - Яскравіший стан */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Головне зображення</label>
            {formData.imageBanner ? (
              <div className="h-32 w-full rounded-xl overflow-hidden border-2 border-slate-200 relative group">
                <img src={formData.imageBanner} className="w-full h-full object-cover" alt="Banner" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                  <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-50 transition-colors">
                    Змінити
                    <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, imageBanner: ""})}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-red-700 transition-colors"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ) : (
              <label className="h-24 w-full flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all group bg-slate-50">
                <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  {isUploading ? <Clock className="animate-spin text-blue-600" size={18} /> : <Plus className="text-blue-600" size={18} />}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-600">
                  {isUploading ? "Завантаження..." : "Натисніть, щоб додати фото"}
                </span>
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" disabled={isUploading} />
              </label>
            )}
          </div>

          {/* Footer - Помітні кнопки */}
          <footer className="flex items-center justify-between mt-4 pt-6 border-t border-slate-100">
            <div>
              {eventToEdit?.id && (
                <button 
                  type="button" 
                  onClick={() => onDelete?.(eventToEdit.id!)}
                  className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-700 underline underline-offset-4 transition-colors"
                >
                  Видалити подію
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Скасувати
              </button>
              <button 
                type="submit" 
                disabled={isUploading}
                className="px-10 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 active:scale-95 disabled:bg-slate-300 transition-all shadow-md shadow-blue-200"
              >
                {eventToEdit ? "Зберегти зміни" : "Опублікувати"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );

};
