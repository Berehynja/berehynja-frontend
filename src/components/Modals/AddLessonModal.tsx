import { useEffect, useState, useRef } from "react";
import type { AgeGroup } from "../../types/ageGroup";
import { COLORS, type LessonColor } from "../../data/colors";
import type { Program } from "../../types/program";
import { AVAILABLE_ICONS, type IconName } from "../../data/icons";
import { Trash2, Upload, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { ConfirmModal } from "./ConfirmModal";
import { Button } from "../Buttons/Button";
import { uploadMedia } from "../../services/cloudinaryService";
import type { LangKey } from "../../types/types";

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Program, "id">, id?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  ageGroups: AgeGroup[];
  programToEdit?: Program | null;
}

export function AddLessonModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  ageGroups,
  programToEdit,
}: AddLessonModalProps) {
  // Додаємо стейт мови
  const [activeLang, setActiveLang] = useState<LangKey>("ua");

  // Стейт тепер тримає об'єкти для мов
  const [title, setTitle] = useState<Record<LangKey, string>>({ ua: "", en: "", de: "" });
  const [description, setDescription] = useState<Record<LangKey, string>>({ ua: "", en: "", de: "" });
  
  const [imageUrl, setImageUrl] = useState("");
  const [selectedColor, setSelectedColor] = useState<LessonColor>("RoyalBlue");
  const [selectedAgeIds, setSelectedAgeIds] = useState<string[]>([]);
  const [iconName, setIconName] = useState<IconName>("sparkles");

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (programToEdit) {
        // Якщо редагуємо, розгортаємо існуючі дані або ставимо порожні рядки
        setTitle(typeof programToEdit.title === 'object' ? programToEdit.title : { ua: programToEdit.title, en: "", de: "" });
        setDescription(typeof programToEdit.description === 'object' ? programToEdit.description : { ua: programToEdit.description || "", en: "", de: "" });
        setImageUrl(programToEdit.image || "");
        setSelectedColor(programToEdit.color);
        setSelectedAgeIds(programToEdit.ageGroupIds);
        setIconName(programToEdit.iconName);
      } else {
        setTitle({ ua: "", en: "", de: "" });
        setDescription({ ua: "", en: "", de: "" });
        setImageUrl("");
        setSelectedColor("RoyalBlue");
        setSelectedAgeIds([]);
        setIconName("sparkles");
      }
      
    }
  }, [isOpen, programToEdit]);

  const toggleAgeGroup = (id: string) => {
    setSelectedAgeIds((prev) =>
      prev.includes(id) ? prev.filter((ageId) => ageId !== id) : [...prev, id]
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Очищаємо ім'я для папки Cloudinary, щоб не було помилок з пробілами
    const folderName = title[activeLang]?.trim() || "programs";

    setIsUploading(true);
    try {
      const res = await uploadMedia(file, "programs", folderName);
      setImageUrl(res.url);
      toast.success("Фото завантажено!");
    } catch {
      toast.error("Помилка завантаження фото");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Перевірка головної мови (UA)
    if (!title.ua.trim() || selectedAgeIds.length === 0) {
      return toast.error("Заповніть назву (UA) та виберіть вікову групу");
    }

    setIsSubmitting(true);
    try {
      await onSave(
        {
          title, 
          description, 
          image: imageUrl,
          color: selectedColor,
          ageGroupIds: selectedAgeIds,
          iconName,
        },
        programToEdit?.id
      );
      onClose();
      toast.success("Програму збережено!");
    } catch {
      toast.error("Помилка збереження");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="font-nunito fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="animate-in fade-in zoom-in flex max-h-[95vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200" onClick={(e) => e.stopPropagation()}>
        
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 text-center">
          <h2 className="text-lg font-bold text-gray-800">
            {programToEdit ? "Налаштування програми" : "Створення програми"}
          </h2>
        </div>

        <div className="custom-scrollbar overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ПЕРЕМИКАЧ МОВ ТА ЧЕКПОІНТИ */}
            <div className="space-y-3">
              <label className="ml-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Мова заповнення:</label>
              <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                {(["ua", "de", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold uppercase transition-all ${
                      activeLang === lang ? "bg-white text-blue-600 shadow" : "text-slate-500"
                    }`}
                  >
                    {lang} {title[lang]?.trim() && <CheckCircle2 size={12} className="ml-1 inline text-green-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* ФОТО */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="ml-1 text-sm font-bold text-gray-700">Ілюстрація програми</label>
                <span className="text-xs font-bold italic text-blue-500">(обов'язково)</span>
              </div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-blue-400 hover:bg-blue-50"
              >
                {imageUrl ? (
                  <>
                    <img src={imageUrl} className="h-full w-full object-cover" alt="Background" />
                    <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-black/70">
                      <Upload className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    {isUploading ? <Loader2 className="animate-spin text-blue-500" /> : <Upload size={32} />}
                    <p className="mt-2 text-xs font-medium">{isUploading ? "Завантажуємо..." : "Натисніть, щоб вибрати фото"}</p>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            {/* НАЗВА */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <label className="ml-1 text-sm font-bold text-gray-700">Назва заняття ({activeLang})</label>
                {activeLang === 'ua' && <span className="text-xs font-bold italic text-blue-500">(обов'язково)</span>}
              </div>
              <input
                type="text"
                value={title[activeLang]}
                onChange={(e) => setTitle({ ...title, [activeLang]: e.target.value })}
                placeholder="Математика, Малювання..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* ОПИС */}
            <div className="space-y-1">
              <label className="ml-1 text-sm font-bold text-gray-700">Опис програми ({activeLang})</label>
              <textarea
                value={description[activeLang]}
                onChange={(e) => setDescription({ ...description, [activeLang]: e.target.value })}
                placeholder="Короткий опис заняття..."
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* КОЛІР */}
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold text-gray-700">Колір акценту</label>
              <div className="flex flex-wrap gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
                {Object.entries(COLORS).map(([name, hex]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedColor(name as LessonColor)}
                    className={`h-7 w-7 rounded-full border-2 transition-transform ${selectedColor === name ? "scale-110 border-gray-600 shadow-lg" : "border-transparent hover:scale-105"}`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {/* ІКОНКА */}
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold text-gray-700">Виберіть іконку</label>
              <div className="custom-scrollbar flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-3">
                {Object.entries(AVAILABLE_ICONS).map(([name, IconComp]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setIconName(name as IconName)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all ${iconName === name ? "border-blue-500 bg-blue-50 text-blue-600" : "border-transparent bg-white text-gray-400 hover:text-gray-600"}`}
                  >
                    <IconComp size={20} />
                  </button>
                ))}
              </div>
            </div>

            {/* ВІКОВІ ГРУПИ */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="ml-1 text-sm font-bold text-gray-700 italic">Цільові групи</label>
                <span className="text-xs font-bold italic text-blue-500">(мінімум одна)</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {ageGroups.map((group) => (
                  <label 
                    key={group.id} 
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
                      selectedAgeIds.includes(group.id) ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-100 bg-white"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-blue-600" 
                      checked={selectedAgeIds.includes(group.id)} 
                      onChange={() => toggleAgeGroup(group.id)} 
                    />
                    <span className="text-sm font-bold text-gray-700">{group.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-between gap-3 border-t border-gray-100 bg-gray-50 p-4">
          {programToEdit && (
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)} disabled={isSubmitting || isUploading}>
              <Trash2 size={18} />
            </Button>
          )}
          <div className="flex w-full justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>Скасувати</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || isUploading || !title.ua.trim() || selectedAgeIds.length === 0}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : (programToEdit ? "Зберегти" : "Створити")}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          await onDelete(programToEdit!.id);
          onClose();
        }}
        title="Видалення"
        message={`Видалити програму "${title.ua}"?`}
      />
    </div>
  );
}