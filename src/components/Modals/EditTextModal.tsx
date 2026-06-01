import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Перевір свій шлях до firebase
import { CheckCircle2, Loader2, Image as ImageIcon, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

// Перевір шлях до файлу cloudinary.ts
import { uploadMedia, type MediaCategory } from "../../services/cloudinaryService"; 

type LangKey = "ua" | "de" | "en";

type MultilingualText = {
  ua: string;
  de: string;
  en: string;
};

export type FieldConfig = {
  key: string;
  label: string;
  type: "input" | "textarea" | "image";
  mediaCategory?: MediaCategory; // Обов'язково для типу 'image'
};

interface EditTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  sectionName: string;
  modalTitle?: string;
  initialData?: Record<string, unknown> | null;
  fields: FieldConfig[];
}

const getNestedValue = (obj: Record<string, unknown> | null | undefined, path: string): unknown => {
  if (!obj) return null;
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && acc !== null && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
};

export const EditTextModal = ({
  isOpen,
  onClose,
  documentName,
  sectionName,
  modalTitle = "Редагування секції",
  initialData,
  fields,
}: EditTextModalProps) => {
  const [activeLang, setActiveLang] = useState<LangKey>("ua");
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Record<string, MultilingualText>>({});
  const [imageData, setImageData] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const newTextState: Record<string, MultilingualText> = {};
      const newImageState: Record<string, string> = {};

      fields.forEach((field) => {
        if (field.type === "image") {
          newImageState[field.key] = (getNestedValue(initialData, field.key) as string) || "";
        } else {
          const fieldData = (getNestedValue(initialData, field.key) as Partial<MultilingualText>) || {};
          newTextState[field.key] = {
            ua: fieldData.ua || "",
            de: fieldData.de || "",
            en: fieldData.en || "",
          };
        }
      });

      setFormData(newTextState);
      setImageData(newImageState);
    }
  }, [isOpen, initialData, fields]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleLangChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [activeLang]: value },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string, category: MediaCategory = "banners") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading((prev) => ({ ...prev, [fieldKey]: true }));
    try {
      const response = await uploadMedia(file, category);
      setImageData((prev) => ({ ...prev, [fieldKey]: response.url }));
      toast.success("Зображення завантажено!");
    } catch (error) {
      console.error("Помилка завантаження:", error);
      toast.error("Не вдалося завантажити зображення");
    } finally {
      setIsUploading((prev) => ({ ...prev, [fieldKey]: false }));
    }
  };

  const isLangFilled = (lang: LangKey) => {
    if (Object.keys(formData).length === 0) return true; 
    return Object.values(formData).every((field) => field[lang] && field[lang].trim().length > 2);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const docRef = doc(db, "pages", documentName);
      const updatePayload: Record<string, string> = {};

      fields.forEach((field) => {
        if (field.type === "image") {
          if (imageData[field.key]) {
            updatePayload[`${sectionName}.${field.key}`] = imageData[field.key];
          }
        } else {
          const data = formData[field.key];
          if (data) {
            updatePayload[`${sectionName}.${field.key}.ua`] = data.ua;
            updatePayload[`${sectionName}.${field.key}.en`] = data.en;
            updatePayload[`${sectionName}.${field.key}.de`] = data.de;
          }
        }
      });

      await updateDoc(docRef, updatePayload);
      toast.success("Дані успішно оновлено!");
      onClose();
    } catch (error) {
      console.error("Помилка збереження:", error);
      toast.error("Помилка при збереженні");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="animate-in zoom-in-95 flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl duration-200" onClick={(e) => e.stopPropagation()}>
        
        <header className="flex items-center justify-between border-b border-slate-100 px-8 pt-8 pb-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">{modalTitle}</h2>
            <p className="mt-1 text-left text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase">
              Berehynja Admin ({documentName} ➔ {sectionName})
            </p>
          </div>
        </header>

        <form onSubmit={handleSave} className="flex flex-col gap-6 overflow-y-auto p-8">
          
          {Object.keys(formData).length > 0 && (
            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              {(["ua", "en", "de"] as LangKey[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase transition-all ${
                    activeLang === lang ? "bg-white text-blue-700 shadow" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {lang} {isLangFilled(lang) && <CheckCircle2 size={14} className="text-green-600" />}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-6">
            {fields.map((field) => {
              
              if (field.type === "image") {
                return (
                  <div key={field.key} className="flex flex-col gap-1.5 text-left">
                    <label className="ml-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {field.label} (Спільне для всіх мов)
                    </label>
                    <div className="relative flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-all hover:bg-slate-100">
                      {isUploading[field.key] ? (
                        <div className="flex flex-col items-center gap-2 text-blue-600 py-8">
                          <Loader2 className="animate-spin" size={32} />
                          <span className="text-xs font-bold uppercase tracking-wider">Завантаження в Cloudinary...</span>
                        </div>
                      ) : imageData[field.key] ? (
                        <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                          <img src={imageData[field.key]} alt="Preview" className="max-h-64 w-full object-cover" />
                          <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900/80 px-4 py-2 text-xs font-bold text-white shadow backdrop-blur transition-all hover:bg-slate-900 active:scale-95">
                            <UploadCloud size={16} /> Змінити
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, field.key, field.mediaCategory)} />
                          </label>
                        </div>
                      ) : (
                        <label className="flex w-full cursor-pointer flex-col items-center gap-3 py-6 text-slate-500 transition-colors hover:text-blue-600">
                          <div className="rounded-full bg-white p-4 shadow-sm border border-slate-100">
                            <ImageIcon size={28} />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider">Натисніть, щоб завантажити</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, field.key, field.mediaCategory)} />
                        </label>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div key={field.key} className="flex flex-col gap-1.5 text-left">
                  <label className="ml-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {field.label} ({activeLang})
                  </label>

                  {field.type === "input" ? (
                    <input
                      value={formData[field.key]?.[activeLang] || ""}
                      onChange={(e) => handleLangChange(field.key, e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-semibold shadow-sm transition-all outline-none focus:border-blue-500"
                      required
                    />
                  ) : (
                    <textarea
                      rows={3}
                      value={formData[field.key]?.[activeLang] || ""}
                      onChange={(e) => handleLangChange(field.key, e.target.value)}
                      ref={(el) => {
                        if (el) {
                          el.style.height = "auto";
                          el.style.height = `${el.scrollHeight}px`;
                        }
                      }}
                      className="w-full resize-none overflow-hidden rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed font-medium shadow-sm transition-all outline-none focus:border-blue-500"
                      required
                    />
                  )}
                </div>
              );
            })}
          </div>
        </form>

        <footer className="flex items-center justify-end border-t border-slate-100 bg-slate-50/50 p-6 sm:px-8">
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="cursor-pointer rounded-xl px-6 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-200">
              Скасувати
            </button>
            <button type="submit" onClick={handleSave} disabled={isSaving || Object.values(isUploading).some(v => v)} className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-10 py-3 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:bg-blue-600 disabled:bg-slate-300 disabled:shadow-none">
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Зберегти зміни"}
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};