import { useState } from 'react';
import { X, ImageIcon, Check, CheckCircle2, Link as LinkIcon } from "lucide-react";
import { uploadMedia } from '../../services/cloudinaryService';
import type { Partner } from '../../types/partners';
import type { LangKey } from '../../types/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Omit<Partner, 'id'>) => void;
}

export const AddPartnerModal = ({ isOpen, onClose, onSave }: Props) => {
  const [names, setNames] = useState({ ua: "", en: "", de: "" });
  const [link, setLink] = useState("");
  const [logo, setLogo] = useState("");
  const [editLang, setEditLang] = useState<LangKey>('ua');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadMedia(file, 'partners', names.ua || 'partner_logo');
      setLogo(result.url);
    } catch (error) {
      console.error("Помилка завантаження:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    onSave({
      name: names,
      logo: logo,
      link: link.trim() || undefined
    });
    
    setNames({ ua: "", en: "", de: "" });
    setLink("");
    setLogo("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-montserratBold uppercase tracking-tight text-slate-900">
            Додати партнера
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:bg-slate-100 p-2 rounded-full cursor-pointer transition-colors"
          >
            <X size={24}/>
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <label className="relative w-40 h-40 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-blue-400 transition-all">
              {logo ? (
                <img src={logo} className="w-full h-full object-contain p-6" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                  <ImageIcon size={32} />
                  <span className="text-[10px] font-bold uppercase mt-3 tracking-widest">Завантажити лого</span>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={isUploading} />
            </label>
          </div>

          <div className="space-y-4">
            {/* ТАБИ МОВ З ГАЛОЧКАМИ */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
              {(['ua', 'en', 'de'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setEditLang(lang)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                    editLang === lang 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-500'
                  }`}
                >
                  {lang}
                  {/* ГАЛОЧКА: з'являється, якщо в names[lang] є текст */}
                  {names[lang].trim() !== "" && (
                    <CheckCircle2 
                      size={14} 
                      className={editLang === lang ? "text-blue-600" : "text-green-500"} 
                    />
                  )}
                </button>
              ))}
            </div>

            <input 
              value={names[editLang]} 
              onChange={(e) => setNames({...names, [editLang]: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-lg"
              placeholder={`Назва партнера (${editLang.toUpperCase()})...`}
            />
          </div>

          <div className="relative group/input">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
              <LinkIcon size={20} />
            </div>
            <input 
              value={link} 
              onChange={(e) => setLink(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
              placeholder="Посилання на сайт (https://...)"
            />
          </div>

          <button 
            disabled={!names.ua || !logo || isUploading}
            onClick={handleSubmit}
            className="w-full py-5 bg-blue-600 text-white rounded-3xl font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:bg-slate-200 transition-all active:scale-[0.98]"
          >
            {isUploading ? (
              "Завантаження..."
            ) : (
              <>
                <Check size={18} /> Зберегти партнера
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};