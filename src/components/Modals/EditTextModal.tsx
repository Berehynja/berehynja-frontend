import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Ваш шлях
import { CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type LangKey = "ua" | "de" | "en";

type MultilingualText = {
  ua: string;
  de: string;
  en: string;
};

export type FieldConfig = {
  key: string;
  label: string;
  type: "input" | "textarea";
};

interface EditTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string; // Назва документа в БД
  sectionName: string; // Назва секції в БД
  modalTitle?: string; // Заголовок самої модалки
  initialData?: Record<string, unknown> | null;
  fields: FieldConfig[];
}

// Helper для діставання даних з вкладених об'єктів
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

  useEffect(() => {
    if (isOpen) {
      const newState: Record<string, MultilingualText> = {};
      fields.forEach((field) => {
        const fieldData =
          (getNestedValue(initialData, field.key) as Partial<MultilingualText>) || {};
        newState[field.key] = {
          ua: fieldData.ua || "",
          de: fieldData.de || "",
          en: fieldData.en || "",
        };
      });

      setFormData(newState);
    }
  }, [isOpen, initialData, fields]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLangChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [activeLang]: value },
    }));
  };

  const isLangFilled = (lang: LangKey) => {
    if (Object.keys(formData).length === 0) return false;
    // Виправлення №3: додано безпечну перевірку field[lang]
    return Object.values(formData).every((field) => field[lang] && field[lang].trim().length > 2);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const docRef = doc(db, "pages", documentName);
      const updatePayload: Record<string, string> = {};

      fields.forEach((field) => {
        const data = formData[field.key];

        // Виправлення №1: Додано фігурні дужки навколо sectionName
        updatePayload[`${sectionName}.${field.key}.ua`] = data.ua;
        updatePayload[`${sectionName}.${field.key}.en`] = data.en;
        updatePayload[`${sectionName}.${field.key}.de`] = data.de;
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
              {modalTitle}
            </h2>
            <p className="mt-1 text-left text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase">
              Berehynja Admin ({documentName} ➔ {sectionName})
            </p>
          </div>
          {/* <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100"
          >
            <X size={24} />
          </button> */}
        </header>

        <form onSubmit={handleSave} className="flex flex-col gap-6 overflow-y-auto p-8">
          <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            {(["ua", "en", "de"] as LangKey[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase transition-all ${
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
            {/* Виправлення №2: Динамічний рендер полів з масиву fields */}
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5 text-left">
                <label className="ml-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {field.label} ({activeLang})
                </label>

                {field.type === "input" ? (
                  <input
                    value={formData[field.key]?.[activeLang] || ""}
                    onChange={(e) => handleLangChange(field.key, e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-lg font-bold shadow-sm transition-all outline-none focus:border-blue-500"
                    required
                  />
                ) : (
                  <textarea
                    rows={3}
                    value={formData[field.key]?.[activeLang] || ""}
                    onChange={(e) => handleLangChange(field.key, e.target.value)}
                    ref={(el) => {
                      if (el) {
                        el.style.height = "auto"; // Скидаємо висоту для перерахунку
                        el.style.height = `${el.scrollHeight}px`; // Задаємо висоту точно по контенту
                      }
                    }}
                    className="w-full resize-none overflow-hidden rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed font-medium shadow-sm transition-all outline-none focus:border-blue-500"
                    required
                  />
                )}
              </div>
            ))}
          </div>
        </form>
        <footer className="flex items-center justify-end border-t border-slate-100 p-8">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl px-6 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-100"
            >
              Скасувати
            </button>
            <button
              type="submit"
              onClick={handleSave}
              disabled={isSaving}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-10 py-3 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:bg-blue-600 disabled:bg-slate-300"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Зберегти зміни"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
