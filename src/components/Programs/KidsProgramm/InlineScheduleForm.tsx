import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Save, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

import { COLORS, type LessonColor } from "../../../data/colors";
import type { Program } from "../../../types/program";
import type { AgeGroup } from "../../../types/ageGroup";
import type { ScheduleItem } from "../../../types/scheduleItem";

export interface ScheduleFormData {
  lessonId: string;
  timeStart: string;
  timeEnd: string;
  room: LessonColor;
  subGroupId?: string | null;
  level?: string;
  teacher?: string;
}

interface InlineScheduleFormProps {
  groupId: string;
  groupName: string;
  programs: Program[];
  ageGroups: AgeGroup[];
  initialData?: ScheduleItem;
  onSave: (data: ScheduleFormData) => void | Promise<void>;
  onCancel: () => void;
  onDelete?: (id: string, title: string) => void | Promise<void>; // Додали пропс для видалення
}

// ============================================================================
// МІНІ-КОМПОНЕНТ ФОРМИ
// ============================================================================
export function InlineScheduleForm({
  groupId,
  groupName,
  programs,
  ageGroups,
  initialData,
  onSave,
  onCancel,
  onDelete, // Отримуємо функцію видалення
}: InlineScheduleFormProps) {
  const [timeStart, setTimeStart] = useState(initialData?.timeStart || "10:00");
  const [timeEnd, setTimeEnd] = useState(initialData?.timeEnd || "12:00");
  const [lessonId, setLessonId] = useState(initialData?.lessonId || "");
  const [room, setRoom] = useState<LessonColor>(initialData?.room || "RoyalBlue");
  const [level, setLevel] = useState(initialData?.level || "");
  const [teacher, setTeacher] = useState(initialData?.teacher || "");

  const subGroups = ageGroups.filter((g) => g.parentId === groupId);
  const [subGroupId, setSubGroupId] = useState<string>(initialData?.subGroupId || "");
  const { i18n } = useTranslation();

  const handleSubmit = () => {
    if (!lessonId) return toast.error("Будь ласка, оберіть програму!");

    // Створюємо чистий об'єкт тільки з тими полями, що мають значення
    const formData: ScheduleFormData = {
      lessonId,
      timeStart,
      timeEnd,
      room,
      subGroupId: subGroupId || null, // Додаємо subGroupId тільки якщо він є
    };

    if (level.trim()) formData.level = level.trim();
    if (teacher.trim()) formData.teacher = teacher.trim();

    onSave(formData);
  };

  return (
    <div className="animate-in fade-in zoom-in flex flex-col space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-md duration-200">
      <h4 className="border-b border-gray-100 pb-2 text-center text-sm font-bold text-gray-800">
        {initialData ? "Редагування заняття" : `Нове заняття (${groupName})`}
      </h4>

      <div className="flex gap-3">
        <div className="w-1/2 space-y-1">
          <label className="ml-1 text-xs font-bold text-gray-700">Початок</label>
          <input
            type="time"
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
            className="focus:ring-Blue focus:border-Blue w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition-all outline-none focus:bg-white focus:ring-2"
          />
        </div>
        <div className="w-1/2 space-y-1">
          <label className="ml-1 text-xs font-bold text-gray-700">Кінець</label>
          <input
            type="time"
            value={timeEnd}
            onChange={(e) => setTimeEnd(e.target.value)}
            className="focus:ring-Blue focus:border-Blue w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition-all outline-none focus:bg-white focus:ring-2"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="ml-1 text-xs font-bold text-gray-700">Програма</label>
        <select
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          className="focus:ring-Blue focus:border-Blue w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all outline-none focus:bg-white focus:ring-2"
        >
          <option value="" disabled>
            Оберіть програму...
          </option>
          {programs
            .filter(
              (p) =>
                p.ageGroupIds &&
                p.ageGroupIds.some((id) =>
                  [
                    groupId,
                    ...ageGroups.filter((g) => g.parentId === groupId).map((g) => g.id),
                  ].includes(id)
                )
            )
            .map((prog) => (
              <option key={prog.id} value={prog.id}>
                {typeof prog.title === "string"
                  ? prog.title
                  : prog.title[i18n.language as keyof typeof prog.title] || prog.title.ua}
              </option>
            ))}
        </select>
      </div>

      {subGroups.length > 0 && (
        <div className="space-y-1">
          <label className="ml-1 text-xs font-bold text-gray-700">
            Підгрупа (якщо для конкретної)
          </label>
          <select
            value={subGroupId}
            onChange={(e) => setSubGroupId(e.target.value)}
            className="focus:ring-Blue focus:border-Blue w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all outline-none focus:bg-white focus:ring-2"
          >
            <option value="">Для обох підгруп (спільне)</option>
            {subGroups.map((sg) => (
              <option key={sg.id} value={sg.id}>
                {sg.subLabel || sg.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-1">
        <label className="ml-1 text-xs font-bold text-gray-700">Дод. інформація</label>
        <input
          type="text"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="Напр.: Нульовий - 5-6 років"
          className="focus:ring-Blue focus:border-Blue w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all outline-none placeholder:text-gray-400 focus:bg-white focus:ring-2"
        />
      </div>

      <div className="space-y-1">
        <label className="ml-1 text-xs font-bold text-gray-700">Викладач</label>
        <input
          type="text"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          placeholder="Напр.: Марія Іванівна"
          className="focus:ring-Blue focus:border-Blue w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all outline-none placeholder:text-gray-400 focus:bg-white focus:ring-2"
        />
      </div>

      <div className="space-y-2 pt-1">
        <label className="ml-1 text-xs font-bold text-gray-700">Колір кімнати</label>
        <div className="flex flex-wrap justify-between gap-1 rounded-xl border border-gray-100 bg-gray-50/30 p-2">
          {Object.entries(COLORS).map(([name, hex]) => (
            <button
              key={name}
              type="button"
              onClick={() => setRoom(name as LessonColor)}
              className={`h-6 w-6 cursor-pointer rounded-full border-2 transition-transform ${
                room === name
                  ? "scale-110 border-gray-600 shadow-md ring-2 ring-gray-200"
                  : "border-transparent hover:scale-110"
              }`}
              style={{ backgroundColor: hex }}
              title={name}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4 border-t border-gray-100 pt-3">
        {/* Кнопка видалення (показуємо тільки при редагуванні, коли є initialData і onDelete) */}
        {initialData && onDelete && (
          <button
            type="button"
            onClick={() => {
              const programTitle = programs.find((p) => p.id === lessonId)?.title || "це заняття";
              onDelete(
                initialData.id,
                typeof programTitle === "string"
                  ? programTitle
                  : programTitle[i18n.language as keyof typeof programTitle] || programTitle.ua
              );
            }}
            aria-label="Видалити заняття"
            title="Видалити заняття"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={24} aria-hidden="true" />
          </button>
        )}

        <button
          type="button"
          onClick={onCancel}
          aria-label="Скасувати"
          title="Скасувати"
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          aria-label="Зберегти"
          title="Зберегти"
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Save size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ГОЛОВНИЙ КОМПОНЕНТ
