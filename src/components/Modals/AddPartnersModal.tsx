import { useState } from "react";
import { X, ImageIcon, Check, CheckCircle2, Link as LinkIcon } from "lucide-react";
import { uploadMedia } from "../../services/cloudinaryService";
import type { Partner } from "../../types/partners";
import type { LangKey } from "../../types/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Omit<Partner, "id">) => void;
}

export const AddPartnerModal = ({ isOpen, onClose, onSave }: Props) => {
  const [names, setNames] = useState({ ua: "", en: "", de: "" });
  const [link, setLink] = useState("");
  const [logo, setLogo] = useState("");
  const [editLang, setEditLang] = useState<LangKey>("ua");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadMedia(file, "partners", names.ua || "partner_logo");
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
      link: link.trim() || undefined,
    });

    setNames({ ua: "", en: "", de: "" });
    setLink("");
    setLogo("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-in fade-in zoom-in-95 w-full max-w-lg rounded-[2.5rem] bg-white p-8 shadow-2xl duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex items-center justify-between">
          <h3 className="font-nunito text-2xl tracking-tight text-slate-900 uppercase">
            Додати партнера
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <label className="group relative flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-blue-400">
              {logo ? (
                <img src={logo} className="h-full w-full object-contain p-6" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center text-slate-400 transition-colors group-hover:text-blue-500">
                  <ImageIcon size={32} />
                  <span className="mt-3 text-[10px] font-bold tracking-widest uppercase">
                    Завантажити лого
                  </span>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
                accept="image/*"
                disabled={isUploading}
              />
            </label>
          </div>

          <div className="space-y-4">
            {/* ТАБИ МОВ З ГАЛОЧКАМИ */}
            <div className="flex gap-2 rounded-2xl bg-slate-100 p-1">
              {(["ua", "en", "de"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setEditLang(lang)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold uppercase transition-all ${
                    editLang === lang
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-500"
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
              onChange={(e) => setNames({ ...names, [editLang]: e.target.value })}
              className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-6 py-4 text-lg font-medium transition-all outline-none focus:border-blue-500 focus:bg-white"
              placeholder={`Назва партнера (${editLang.toUpperCase()})...`}
            />
          </div>

          <div className="group/input relative">
            <div className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/input:text-blue-500">
              <LinkIcon size={20} />
            </div>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded-2xl border-2 border-transparent bg-slate-50 py-4 pr-6 pl-14 font-medium transition-all outline-none focus:border-blue-500 focus:bg-white"
              placeholder="Посилання на сайт (https://...)"
            />
          </div>

          <button
            disabled={!names.ua || !logo || isUploading}
            onClick={handleSubmit}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-3xl bg-blue-600 py-5 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:bg-slate-200"
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
