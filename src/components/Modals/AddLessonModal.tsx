import { useEffect, useState } from "react";
import type { AgeGroup } from "../../types/ageGroup";
import { COLORS, type LessonColor } from "../../data/colors";
import type { Program } from "../../types/program";
import { AVAILABLE_ICONS, type IconName } from "../../data/icons";
import { Trash2, CircleAlert } from "lucide-react";
import toast from "react-hot-toast";
import { ConfirmModal } from "./ConfirmModal";
import { Button } from "../Buttons/Button";

// Пропси: що модалка очікує від батьківського компонента
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState<LessonColor>("RoyalBlue");
  const [selectedAgeIds, setSelectedAgeIds] = useState<string[]>([]);
  const [iconName, setIconName] = useState<IconName>("sparkles");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isFormValid = title.trim().length > 0 && selectedAgeIds.length > 0;

  // Скидання форми при відкритті
  useEffect(() => {
    if (isOpen) {
      if (programToEdit) {
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
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

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
    if (!title.trim()) return toast.error("Будь ласка, введіть назву програми.");
    if (selectedAgeIds.length === 0)
      return toast.error("Будь ласка, оберіть хоча б одну вікову групу.");

    setIsSubmitting(true);
    try {
      await onSave(
        {
          title,
          description,
          color: selectedColor,
          ageGroupIds: selectedAgeIds,
          iconName,
        },
        programToEdit?.id
      );
      onClose();
      toast.success(programToEdit ? "Програма успішно оновлена!" : "Програма успішно додана!");
    } catch (error) {
      console.error("Помилка при збереженні програми:", error);
      toast.error("Сталася помилка при збереженні програми. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Обробка кліку на видалення
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };
  // Підтвердження видалення
  const handleConfirmDelete = async () => {
    if (!programToEdit?.id) return;

    setIsSubmitting(true);
    try {
      await onDelete(programToEdit.id);
      setIsDeleteModalOpen(false);
      onClose();
      toast.success("Програма успішно видалена!");
    } catch (error) {
      console.error("Помилка при видаленні програми:", error);
      toast.error("Сталася помилка при видаленні програми. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Якщо модалка закрита - нічого не рендеримо
  if (!isOpen) return null;

  return (
    // Overlay (фон)
    <div
      className="font-nunito fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Window */}
      <div
        className="animate-in fade-in zoom-in flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- HEADER --- */}
        <div className="relative flex items-center justify-center border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h2 className="text-preset-3 px-4 font-bold text-gray-800">
            {programToEdit ? "Редагувати програму" : "Додати нову програму"}
          </h2>
        </div>

        {/* --- BODY (Scrollable) --- */}
        <div className="custom-scrollbar overflow-y-auto p-6">
          <form id="program-form" onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Назва */}
            <div className="space-y-1">
              <div className="ml-1 flex items-center gap-2">
                <label
                  htmlFor="program-title"
                  className="ml-1 flex items-center gap-1 text-sm font-bold text-gray-700"
                >
                  Назва заняття
                </label>
                <div className="group relative flex items-center">
                  <CircleAlert size={16} className="text-Red" />
                  <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-2 hidden w-48 -translate-y-1/2 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs font-medium opacity-0 shadow-lg transition-opacity group-hover:block group-hover:opacity-100">
                    Це поле обов'язкове
                  </div>
                </div>
              </div>
              <input
                id="program-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Наприклад: Англійська мова"
                className="focus:ring-Blue focus:border-Blue w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all outline-none placeholder:text-gray-400 focus:bg-white focus:ring-2"
                autoFocus
              />
            </div>

            {/* 2. Колір */}
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold text-gray-700">Колір картки</label>
              <div className="flex flex-wrap justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50/30 p-3">
                {Object.entries(COLORS).map(([name, hex]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedColor(name as LessonColor)}
                    className={`h-8 w-8 cursor-pointer rounded-full border-2 transition-transform ${
                      selectedColor === name
                        ? "scale-110 border-gray-600 shadow-md ring-2 ring-gray-200"
                        : "border-transparent hover:scale-110"
                    }`}
                    style={{ backgroundColor: hex }}
                    title={name}
                  />
                ))}
              </div>
              {/* <div className="ml-1 text-xs text-gray-400">
                Обрано:{" "}
                <span className="font-medium text-gray-600">
                  {selectedColor}
                </span>
              </div> */}
            </div>

            {/* 3. Вибір Іконки */}
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold text-gray-700">Оберіть іконку</label>

              {/* Контейнер для сітки іконок */}
              <div className="custom-scrollbar flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/30 p-3">
                {Object.entries(AVAILABLE_ICONS).map(([name, IconComponent]) => (
                  <button
                    key={name}
                    type="button"
                    // При кліку записуємо ім'я іконки в стейт
                    onClick={() => setIconName(name as IconName)}
                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                      iconName === name
                        ? // Стиль, якщо іконка вибрана (синя рамка, синій фон)
                          "scale-110 border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                        : // Стиль звичайної іконки (сіра, білий фон)
                          "border-transparent bg-white text-gray-400 hover:scale-105 hover:bg-gray-100 hover:text-gray-600"
                    } `}
                    title={name} // Показує назву при наведенні мишки
                  >
                    {/* Рендеримо компонент іконки */}
                    <IconComponent className="h-5 w-5" strokeWidth={2} />
                  </button>
                ))}
              </div>

              {/* Підпис, що саме обрано */}
              {/* <div className="ml-1 text-xs text-gray-400">
                Обрана іконка:{" "}
                <span className="font-medium text-gray-600">{iconName}</span>
              </div> */}
            </div>

            {/* 3. Вікові групи */}
            <div className="space-y-2">
              <label className="ml-1 flex items-center gap-1 text-sm font-bold text-gray-700">
                Для кого це заняття?
                <div className="group relative flex items-center">
                  <CircleAlert size={16} className="text-Red" />
                  <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-2 hidden w-48 -translate-y-1/2 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs font-medium opacity-0 shadow-lg transition-opacity group-hover:block group-hover:opacity-100">
                    Це поле обов'язкове
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {ageGroups.length === 0 ? (
                  <p className="p-2 text-sm text-gray-400 italic">Завантаження груп...</p>
                ) : (
                  ageGroups.map((group) => {
                    const isChecked = selectedAgeIds.includes(group.id);
                    return (
                      <label
                        key={group.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                          isChecked
                            ? "border-Blue/30 bg-blue-50 shadow-sm"
                            : "border-gray-100 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                            isChecked ? "bg-Blue border-Blue" : "border-gray-300 bg-white"
                          }`}
                        >
                          {isChecked && (
                            <svg
                              className="h-3.5 w-3.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={() => toggleAgeGroup(group.id)}
                        />
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-bold ${isChecked ? "text-gray-800" : "text-gray-600"}`}
                          >
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
              <label className="ml-1 text-sm font-bold text-gray-700">Опис (необов'язково)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Чим діти будуть займатися..."
                className="focus:ring-Blue focus:border-Blue w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all outline-none focus:bg-white focus:ring-2"
              />
            </div>
          </form>
        </div>

        {/* --- FOOTER --- */}
        <div className="flex justify-evenly gap-3 border-t border-gray-100 bg-gray-50 p-4">
          {/* КНОПКА ВИДАЛЕННЯ (тільки в режимі редагування) */}
          {programToEdit && (
            <div>
              <Button variant="danger" onClick={handleDeleteClick} disabled={isSubmitting}>
                <Trash2 size={18} />
                <span>Видалити</span>
              </Button>
            </div>
          )}

          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Скасувати
          </Button>

          <Button onClick={handleSubmit} disabled={isSubmitting || !isFormValid}>
            {programToEdit ? "Зберегти зміни" : "Створити програму"}
          </Button>
        </div>
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Видалити програму?"
        message={`Ви точно хочете видалити програму "${programToEdit?.title}"? Цю дію не можна буде скасувати.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}
