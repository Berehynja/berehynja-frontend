import { useEffect, useState } from "react";
import type { AgeGroup } from "../../types/ageGroup";
import { COLORS, type LessonColor } from "../../data/colors";
import type { Program } from "../../types/program";
import { AVAILABLE_ICONS, type IconName } from "../../data/icons";

// Пропси: що модалка очікує від батьківського компонента
interface AddLessonModalProps{
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Program, "id">, id?: string) => Promise<void>;
    ageGroups: AgeGroup[];
    programToEdit?: Program | null;
}
export function AddLessonModal({isOpen, onClose, onSave, ageGroups, programToEdit}: AddLessonModalProps){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedColor, setSelectedColor] = useState<LessonColor>("RoyalBlue");
    const [selectedAgeIds, setSelectedAgeIds] = useState<string[]>([]);
    const [iconName, setIconName] = useState<IconName>("sparkles");
    const [isSubmitting, setIsSubmitting] = useState(false);

// Скидання форми при відкритті
useEffect(() => {
    if(isOpen){
        if(programToEdit){
            // === РЕЖИМ РЕДАГУВАННЯ (заповнюємо форму існуючими даними) ===
            setTitle(programToEdit.title);
            setDescription(programToEdit.description || "");
            setSelectedColor(programToEdit.color);
            setSelectedAgeIds(programToEdit.ageGroupIds);
            setIconName(programToEdit.iconName);
        } else {
            // === РЕЖИМ СТВОРЕННЯ (чистимо форму) ===
            setTitle("");
            setDescription("");
            setSelectedColor("RoyalBlue");
            setSelectedAgeIds([]);
            setIconName("sparkles");
        }
        setIsSubmitting(false);
    }

}, [isOpen, programToEdit]);

// Закриття на ESC
useEffect(() => {
const handleEsc = (e: KeyboardEvent) => {
    if(e.key === "Escape") onClose();
};
if(isOpen) window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
}, [isOpen, onClose])

// Якщо модалка закрита - нічого не рендеримо
  if (!isOpen) return null;

// Обробка кліку на чекбокс
const toggleAgeGroup = (id: string) => {
    setSelectedAgeIds((prev) => 
        prev.includes(id) ? prev.filter((ageId) => ageId !== id) : [...prev, id]
    );
};

// Обробка сабміту форми
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валідація
    if(!title.trim()) return alert("Будь ласка, введіть назву програми.");
    if(selectedAgeIds.length === 0) return alert("Будь ласка, оберіть хоча б одну вікову групу.");

    setIsSubmitting(true);
    try {
        await onSave({
            title, description, color: selectedColor, ageGroupIds: selectedAgeIds, iconName,
        }, programToEdit?.id);
        onClose();
    } catch (error) {
        console.error("Помилка при збереженні програми:", error);
        alert("Сталася помилка при збереженні програми. Спробуйте ще раз.");
    } finally {
        setIsSubmitting(false);
        
    }
};
return (
    // Overlay (фон)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-nunito"
      onClick={onClose}
    >
      {/* Modal Window */}
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* --- HEADER --- */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">
            {programToEdit ? "Редагувати програму" : "Додати нову програму"}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors text-2xl"
          >
            &times;
          </button>
        </div>

        {/* --- BODY (Scrollable) --- */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="program-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Назва */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Назва заняття</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Наприклад: Англійська мова"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-Blue focus:border-Blue outline-none transition-all placeholder:text-gray-400"
                autoFocus
              />
            </div>

            {/* 2. Колір */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Колір картки</label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50/30">
                {Object.entries(COLORS).map(([name, hex]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedColor(name as LessonColor)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      selectedColor === name 
                        ? "border-gray-600 scale-110 shadow-md ring-2 ring-gray-200" 
                        : "border-transparent hover:scale-110"
                    }`}
                    style={{ backgroundColor: hex }}
                    title={name}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-400 ml-1">
                Обрано: <span className="font-medium text-gray-600">{selectedColor}</span>
              </div>
            </div>


            {/* 3. Вибір Іконки */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Оберіть іконку</label>
              
              {/* Контейнер для сітки іконок */}
              <div className="flex flex-wrap gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50/30 max-h-48 overflow-y-auto custom-scrollbar">
                {Object.entries(AVAILABLE_ICONS).map(([name, IconComponent]) => (
                  <button
                    key={name}
                    type="button"
                    // При кліку записуємо ім'я іконки в стейт
                    onClick={() => setIconName(name as IconName)}
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-200
                      ${iconName === name 
                        // Стиль, якщо іконка вибрана (синя рамка, синій фон)
                        ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm scale-110" 
                        // Стиль звичайної іконки (сіра, білий фон)
                        : "border-transparent bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-100 hover:scale-105"
                      }
                    `}
                    title={name} // Показує назву при наведенні мишки
                  >
                    {/* Рендеримо компонент іконки */}
                    <IconComponent className="w-5 h-5" strokeWidth={2} />
                  </button>
                ))}
              </div>
              
              {/* Підпис, що саме обрано */}
              <div className="text-xs text-gray-400 ml-1">
                Обрана іконка: <span className="font-medium text-gray-600">{iconName}</span>
              </div>
            </div>

            {/* 3. Вікові групи */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Для кого це заняття?</label>
              <div className="grid grid-cols-1 gap-2">
                {ageGroups.length === 0 ? (
                  <p className="text-sm text-gray-400 italic p-2">Завантаження груп...</p>
                ) : (
                  ageGroups.map((group) => {
                    const isChecked = selectedAgeIds.includes(group.id);
                    return (
                      <label 
                        key={group.id} 
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isChecked 
                            ? "bg-blue-50 border-Blue/30 shadow-sm" 
                            : "bg-white border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          isChecked ? "bg-Blue border-Blue" : "bg-white border-gray-300"
                        }`}>
                          {isChecked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={() => toggleAgeGroup(group.id)}
                        />
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${isChecked ? "text-gray-800" : "text-gray-600"}`}>
                            {group.label}
                          </span>
                          {group.subLabel && (
                            <span className="text-xs text-gray-400">{group.subLabel}</span>
                          )}
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* 4. Опис */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Опис (необов'язково)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Чим діти будуть займатися..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-Blue focus:border-Blue outline-none transition-all resize-none"
              />
            </div>
          </form>
        </div>

        {/* --- FOOTER --- */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Скасувати
          </button>
          <button
            type="submit"
            form="program-form"
            className="px-6 py-2.5 rounded-xl bg-Blue text-white font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-wait"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Створення..." : "Створити програму"}
          </button>
        </div>

      </div>
    </div>
  );

} 