import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Camera, CheckCircle2, User, Briefcase, GraduationCap, Award, Wrench } from "lucide-react";
import { uploadMedia } from '../../services/cloudinaryService';
import type { TeamMember } from "../../types/teamMember";
import type { LangKey } from '../../types/types';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TeamMember) => void;
  memberToEdit?: TeamMember | null;
  onDelete?: (memberId: string) => void;
}

export const AddTeamMemberModal = ({ isOpen, onClose, onSave, onDelete, memberToEdit }: AddTeamMemberModalProps) => {
  const [activeLang, setActiveLang] = useState<LangKey>('ua');
  const [isUploading, setIsUploading] = useState(false);

  // Функція для створення порожнього стану (як у модалці подій)
  const getEmptyFormState = (): TeamMember => ({
    name: { ua: "", en: "", de: "" },
    role: { ua: "", en: "", de: "" },
    description: { ua: "", en: "", de: "" },
    skills: { ua: [], en: [], de: [] },
    education: { ua: "", en: "", de: "" },
    image: "",
  });

  const [formData, setFormData] = useState<TeamMember>(getEmptyFormState());

  // Синхронізація зі станом редагування
  useEffect(() => {
    if (isOpen) {
      if (memberToEdit) {
        setFormData({ ...memberToEdit });
      } else {
        setFormData(getEmptyFormState());
      }
    }
  }, [memberToEdit, isOpen]);

  const handleTextChange = (field: keyof Omit<TeamMember, 'id' | 'skills' | 'image'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [activeLang]: value }
    }));
  };

  const addSkill = () => {
    if (formData.skills[activeLang].length >= 6) return;
    setFormData(prev => ({
      ...prev,
      skills: { 
        ...prev.skills, 
        [activeLang]: [...(prev.skills[activeLang] || []), ""] 
      }
    }));
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...formData.skills[activeLang]];
    newSkills[index] = value;
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [activeLang]: newSkills }
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: { 
        ...prev.skills, 
        [activeLang]: prev.skills[activeLang].filter((_, i) => i !== index) 
      }
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadMedia(file, 'team', formData.name[activeLang]?.trim() || 'member');
      setFormData(prev => ({ ...prev, image: result.url }));
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Відправляємо об'єкт (з id якщо редагуємо, без - якщо новий)
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3" onClick={onClose}>
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
            {memberToEdit ? "Редагування профілю" : "Новий фахівець"}
          </h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 custom-scrollbar">
          
          {/* Фото та перемикач мов */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start border-b border-slate-50 pb-6">
            <div className="relative w-32 h-40 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden shrink-0 group">
              {formData.image ? (
                <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 text-center px-2">
                  <Camera size={20} />
                  <span className="text-[9px] font-bold uppercase">Фото</span>
                </div>
              )}
              <label className="absolute inset-0 cursor-pointer bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <Plus className="text-white" size={24} />
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            <div className="flex-1 w-full space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Мова заповнення:</label>
              <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
                {(['ua', 'de', 'en'] as const).map((lang) => (
                  <button
                    key={lang} type="button" onClick={() => setActiveLang(lang)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                      activeLang === lang ? 'bg-white shadow text-blue-600' : 'text-slate-500'
                    }`}
                  >
                    {lang} {formData.name[lang] && <CheckCircle2 size={10} className="inline ml-1 text-green-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Поля вводу */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><User size={12} className="text-blue-500"/> Ім'я ({activeLang})</label>
              <input 
                required value={formData.name[activeLang]} 
                onChange={(e) => handleTextChange('name', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><Briefcase size={12} className="text-blue-500"/> Посада ({activeLang})</label>
              <input 
                required value={formData.role[activeLang]} 
                onChange={(e) => handleTextChange('role', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><GraduationCap size={14} className="text-blue-500"/> Освіта ({activeLang})</label>
            <input 
              value={formData.education[activeLang]} 
              onChange={(e) => handleTextChange('education', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Навички */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><Wrench size={12} className="text-blue-500"/> Навички</label>
              <button 
                type="button" onClick={addSkill}
                className="text-[9px] font-bold text-blue-600 bg-white px-2 py-1 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1"
              >
                <Plus size={10} /> Додати
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.skills[activeLang]?.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    value={skill} onChange={(e) => updateSkill(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400"
                  />
                  <button type="button" onClick={() => removeSkill(index)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><Award size={12} className="text-blue-500"/> Досвід ({activeLang})</label>
            <textarea 
              rows={3} value={formData.description[activeLang]} 
              onChange={(e) => handleTextChange('description', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>

          {/* Кнопки */}
          <footer className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-100 gap-4 mt-4">
            {memberToEdit && (
              <button 
                type="button" 
                onClick={() => onDelete?.(memberToEdit.id!)} 
                className="text-[9px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
              >
                Видалити профіль
              </button>
            )}
            <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
              <button type="button" onClick={onClose} className="flex-1 sm:flex-none px-6 py-2 text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600">
                Скасувати
              </button>
              <button 
                type="submit" disabled={isUploading}
                className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:bg-slate-300"
              >
                {isUploading ? "Завантаження..." : "Зберегти"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};