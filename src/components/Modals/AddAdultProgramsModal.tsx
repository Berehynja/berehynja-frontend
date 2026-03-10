import { useState, useEffect, useMemo } from 'react';
import type { ProgramAdults } from "../../types/program";
import { uploadMedia } from '../../services/cloudinaryService';
import { Calendar, 
    Clock, 
    // Target, 
    Users, 
    CheckCircle2,
    X, 
    Plus, 
    Trash2, 
    Loader2, 
    Hourglass,
    MapPin } from 'lucide-react';
import type { LangKey } from '../../types/types';

type AddProgramModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProgramAdults) => void;
  programToEdit?: ProgramAdults | null;
  onDelete?: (id: string) => void;
};



export const AddProgramModal = ({ isOpen, onClose, onSave, onDelete, programToEdit }: AddProgramModalProps) => {
  const [activeLang, setActiveLang] = useState<LangKey>('ua');
  const [isUploading, setIsUploading] = useState(false);

  const initialFormState = useMemo<ProgramAdults>(() => ({
    id: "",
    title: { ua: "", de: "", en: "" },
    descriptions: { ua: "", de: "", en: "" },
    fullDescription: { ua: "", de: "", en: "" },
    dateRange: "",
    duration: { ua: "", de: "", en: "" },
    intensity: { ua: "", de: "", en: "" },
    target: { ua: "", de: "", en: "" },
    capacity: { ua: "", de: "", en: "" },
    image: "",
    location: { ua: "", de: "", en: "" },
    features: { ua: [], de: [], en: [] },
  }), []);

  const [formData, setFormData] = useState<ProgramAdults>(initialFormState);

  useEffect(() => {
    if (isOpen) {
      setFormData(programToEdit ? { ...initialFormState, ...programToEdit } : initialFormState);
    }
  }, [programToEdit, isOpen, initialFormState]);

  const handleLangChange = (field: keyof ProgramAdults, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...(prev[field] as object), [activeLang]: value }
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadMedia(file, 'programs', formData.title.ua || 'adult-program');
      setFormData(prev => ({ ...prev, image: result.url }));
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const isLangFilled = (lang: LangKey) => formData.title[lang].length > 2;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {programToEdit ? "Редагування" : "Створення"} програми
            </h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1 text-left">Berehynja Admin</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
            <X size={24} />
          </button>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 overflow-y-auto flex flex-col gap-6">
          
          {/* Зображення з кнопками поверх (як у прикладі) */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Головне зображення</label>
            {formData.image ? (
              <div className="h-40 w-full rounded-2xl overflow-hidden border-2 border-slate-200 relative group">
                <img src={formData.image} className="w-full h-full object-cover" alt="Banner" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                  <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-50 transition-colors">
                    Змінити
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, image: ""})}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-red-700"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ) : (
              <label className="h-32 w-full flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl hover:bg-blue-50 hover:border-blue-400 transition-all bg-slate-50 group">
                <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  {isUploading ? <Loader2 className="animate-spin text-blue-600" size={20} /> : <Plus className="text-blue-600" size={20} />}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {isUploading ? "Завантаження..." : "Додати обкладинку"}
                </span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
              </label>
            )}
          </div>

          {/* Загальні поля: Дати та Тривалість */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                <Calendar size={14} className="text-blue-600" /> Період (дати)
              </label>
              <input 
                value={formData.dateRange} 
                onChange={(e) => setFormData({...formData, dateRange: e.target.value})}
                placeholder="15.05 - 25.05"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:bg-white outline-none transition-all" 
              />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                <Hourglass size={14} className="text-blue-600" /> Тривалість ({activeLang})
              </label>
              <input 
                value={formData.duration[activeLang]} 
                onChange={(e) => handleLangChange('duration', e.target.value)}
                placeholder="напр. 10 днів"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:bg-white outline-none transition-all" 
              />
            </div>
          </div>

          {/* Перемикач мов */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            {(['ua', 'de', 'en'] as const).map((lang) => (
              <button
                key={lang} type="button" onClick={() => setActiveLang(lang)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  activeLang === lang ? 'bg-white shadow text-blue-700' : 'text-slate-500'
                }`}
              >
                {lang} {isLangFilled(lang) && <CheckCircle2 size={14} className="text-green-600" />}
              </button>
            ))}
          </div>

          {/* Багатомовний контент */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Назва ({activeLang})</label>
              <input 
                value={formData.title[activeLang]} 
                onChange={(e) => handleLangChange('title', e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-lg font-bold focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Опис ({activeLang})</label>
              <textarea 
                rows={3} value={formData.descriptions[activeLang]} 
                onChange={(e) => handleLangChange('descriptions', e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none transition-all shadow-sm resize-none"
              />
            </div>

            {/* Додаткові параметри */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  <Clock size={14} className="text-orange-500" /> Графік
                </label>
                <input 
                  value={formData.intensity[activeLang]} 
                  onChange={(e) => handleLangChange('intensity', e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold" 
                />
              </div>
              {/* <div className="flex flex-col gap-1.5 text-left">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  <Target size={14} className="text-purple-500" /> Ціль
                </label>
                <input 
                  value={formData.target[activeLang]} 
                  onChange={(e) => handleLangChange('target', e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold" 
                />
              </div> */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  <Users size={14} className="text-green-500" /> Група
                </label>
                <input 
                  value={formData.capacity[activeLang]} 
                  onChange={(e) => handleLangChange('capacity', e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold" 
                />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  <MapPin size={14} className="text-green-500" /> Локація
                </label>
                <input 
                  value={formData.location[activeLang]} 
                  onChange={(e) => handleLangChange('location', e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold" 
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-between mt-4 pt-6 border-t border-slate-100">
            <div>
              {programToEdit?.id && (
                <button 
                  type="button" 
                  onClick={() => onDelete?.(programToEdit.id)}
                  className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} /> Видалити програму
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">
                Скасувати
              </button>
              <button 
                type="submit" disabled={isUploading}
                className="px-10 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 disabled:bg-slate-300 transition-all shadow-lg flex items-center gap-2"
              >
                {isUploading ? <Loader2 size={14} className="animate-spin" /> : "Зберегти"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};
