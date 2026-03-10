import { useState, useEffect, useMemo } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Ваш шлях
import { CheckCircle2, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type LangKey = "ua" | "de" | "en";

type MultilingualText = {
  ua: string;
  de: string;
  en: string;
};

// В майбутньому сюди можна буде легко додавати нові поля (наприклад, subtitle, buttonText)
type SectionFormData = {
  title: MultilingualText;
  description: MultilingualText;
};

interface EditTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string; // Назва документа в БД (наприклад, "home")
  sectionName: string; // Назва секції в БД (наприклад, "hero")
  modalTitle?: string; // Заголовок самої модалки (опціонально)
  initialData: Partial<SectionFormData> | null; // Об'єкт з даними саме цієї секції
}

export const EditTextModal = ({
  isOpen,
  onClose,
  documentName,
  sectionName,
  modalTitle = "Редагування секції",
  initialData,
}: EditTextModalProps) => {
  const [activeLang, setActiveLang] = useState<LangKey>("ua");
  const [isSaving, setIsSaving] = useState(false);

  const initialFormState = useMemo<SectionFormData>(
    () => ({
      title: { ua: "", de: "", en: "" },
      description: { ua: "", de: "", en: "" },
    }),
    []
  );

  const [formData, setFormData] = useState<SectionFormData>(initialFormState);

  // Підтягуємо дані
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: {
          ua: initialData?.title?.ua || "",
          de: initialData?.title?.de || "",
          en: initialData?.title?.en || "",
        },
        description: {
          ua: initialData?.description?.ua || "",
          de: initialData?.description?.de || "",
          en: initialData?.description?.en || "",
        },
      });
    }
  }, [isOpen, initialData]);

  const handleLangChange = (field: keyof SectionFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [activeLang]: value },
    }));
  };

  const isLangFilled = (lang: LangKey) =>
    formData.title[lang].trim().length > 2 && formData.description[lang].trim().length > 2;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Звертаємось до правильного документа
      const docRef = doc(db, "pages", documentName);

      // 2. Динамічно формуємо шляхи для оновлення (наприклад, "hero.title.ua" або "about.title.ua")
      await updateDoc(docRef, {
        [`${sectionName}.title.ua`]: formData.title.ua,
        [`${sectionName}.title.en`]: formData.title.en,
        [`${sectionName}.title.de`]: formData.title.de,
        [`${sectionName}.description.ua`]: formData.description.ua,
        [`${sectionName}.description.en`]: formData.description.en,
        [`${sectionName}.description.de`]: formData.description.de,
      });

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-in zoom-in-95 flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-4xl bg-white shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-8 pt-8 pb-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              {modalTitle} {/* Динамічний заголовок модалки */}
            </h2>
            <p className="mt-1 text-left text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase">
              Berehynja Admin ({documentName} ➔ {sectionName})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100"
          >
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSave} className="flex flex-col gap-6 overflow-y-auto p-8">
          <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            {(["ua", "en", "de"] as LangKey[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase transition-all ${
                  activeLang === lang
                    ? "bg-white text-blue-700 shadow"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {lang} {isLangFilled(lang) && <CheckCircle2 size={14} className="text-green-600" />}
              </button>
            ))}
          </div>

          <div className="space-y-5">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="ml-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Заголовок ({activeLang})
              </label>
              <input
                value={formData.title[activeLang]}
                onChange={(e) => handleLangChange("title", e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-lg font-bold shadow-sm transition-all outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="ml-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Опис ({activeLang})
              </label>
              <textarea
                rows={5}
                value={formData.description[activeLang]}
                onChange={(e) => handleLangChange("description", e.target.value)}
                className="w-full resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed font-medium shadow-sm transition-all outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <footer className="mt-4 flex items-center justify-end border-t border-slate-100 pt-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-6 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-100"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-10 py-3 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:bg-blue-600 disabled:bg-slate-300"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Зберегти зміни"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};
