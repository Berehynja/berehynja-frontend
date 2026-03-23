import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider/useAuth";
import { COLORS, type LessonColor } from "../../data/colors";
import type { Program } from "../../types/program";
import type { AgeGroup } from "../../types/ageGroup";
import type { ScheduleItem } from "../../types/scheduleItem";
import { scheduleService } from "../../services/scheduleService";
import { getNextSundayDate } from "../../utils/dateUtils";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface ScheduleCalendarProps {
  programs: Program[];
  ageGroups: AgeGroup[];
}

export interface ScheduleFormData {
  lessonId: string;
  timeStart: string;
  timeEnd: string;
  room: LessonColor;
  level?: string;
  teacher?: string;
}

interface InlineScheduleFormProps {
  groupId: string;
  groupName: string;
  programs: Program[];
  ageGroups: AgeGroup[];
  initialData?: ScheduleItem;
  onSave: (data: ScheduleFormData) => void;
  onCancel: () => void;
  onDelete?: (id: string, title: string) => void; // Додали пропс для видалення
}

// ============================================================================
// МІНІ-КОМПОНЕНТ ФОРМИ
// ============================================================================
function InlineScheduleForm({
  groupId,
  groupName,
  programs,
  ageGroups,
  initialData,
  onSave,
  onCancel,
  onDelete, // Отримуємо функцію видалення
}: InlineScheduleFormProps) {
  const [timeStart, setTimeStart] = useState(initialData?.timeStart || "15:00");
  const [timeEnd, setTimeEnd] = useState(initialData?.timeEnd || "16:00");
  const [lessonId, setLessonId] = useState(initialData?.lessonId || "");
  const [room, setRoom] = useState<LessonColor>(initialData?.room || "RoyalBlue");
  const [level, setLevel] = useState(initialData?.level || "");
  const [teacher, setTeacher] = useState(initialData?.teacher || "");

  const handleSubmit = () => {
    if (!lessonId) return toast.error("Будь ласка, оберіть програму!");

    // Створюємо чистий об'єкт тільки з тими полями, що мають значення
    const formData: ScheduleFormData = {
      lessonId,
      timeStart,
      timeEnd,
      room,
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
                {prog.title}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="ml-1 text-xs font-bold text-gray-700">Доп. інформація</label>
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

      <div className="mt-2 flex justify-end gap-2 border-t border-gray-100 pt-3">
        {/* Кнопка видалення (показуємо тільки при редагуванні, коли є initialData і onDelete) */}
        {initialData && onDelete && (
          <div className="flex w-full justify-center">
            <button
              onClick={() => {
                const programTitle = programs.find((p) => p.id === lessonId)?.title || "це заняття";
                onDelete(initialData.id, programTitle);
              }}
              className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={24} />
            </button>
          </div>
        )}

        <button
          onClick={onCancel}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200"
        >
          Скасувати
        </button>
        <button
          onClick={handleSubmit}
          className="bg-Blue rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-600"
        >
          Зберегти
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ГОЛОВНИЙ КОМПОНЕНТ
// ============================================================================
export function ScheduleCalendar({ programs, ageGroups }: ScheduleCalendarProps) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);
  const { isAdmin } = useAuth();

  const [addingForGroup, setAddingForGroup] = useState<string | null>(null);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  const newDate = getNextSundayDate();

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoadingSchedules(true);
      try {
        const data = await scheduleService.getSchedules();
        setSchedules(data);
      } catch (error) {
        console.error("Помилка при завантаженні розкладу:", error);
      } finally {
        setIsLoadingSchedules(false);
      }
    };
    fetchSchedules();
  }, []);

  const handleSaveAdd = async (groupId: string, data: ScheduleFormData) => {
    try {
      const newScheduleData = { ...data, ageGroupId: groupId, date: newDate };
      const addedSchedule = await scheduleService.addSchedule(newScheduleData);
      setSchedules((prev) => [...prev, addedSchedule as ScheduleItem]);
      setAddingForGroup(null);
      toast.success("Заняття додано до розкладу!");
    } catch (error) {
      console.error("Помилка:", error);
      toast.error("Помилка при збереженні.");
    }
  };

  const handleSaveEdit = async (scheduleId: string, data: ScheduleFormData) => {
    try {
      await scheduleService.updateSchedule(scheduleId, data);

      setSchedules((prev) =>
        prev.map((sch) => {
          if (sch.id === scheduleId) {
            // Важливо: спочатку беремо старий об'єкт,
            // потім видаляємо з нього необов'язкові поля,
            // і накладаємо нові дані 'data'
            const updated = { ...sch, ...data };
            if (!data.level) delete updated.level;
            if (!data.teacher) delete updated.teacher;
            return updated;
          }
          return sch;
        })
      );

      setEditingScheduleId(null);
      toast.success("Заняття успішно оновлено!");
    } catch (error) {
      console.error("Помилка при оновленні:", error);
      toast.error("Помилка при оновленні.");
    }
  };

  const handleDeleteSchedule = async (scheduleId: string, title: string) => {
    const confirmDelete = window.confirm(`Ви точно хочете видалити заняття "${title}" з розкладу?`);
    if (!confirmDelete) return;

    try {
      await scheduleService.deleteSchedule(scheduleId);
      setSchedules((prev) => prev.filter((sch) => sch.id !== scheduleId));
      setEditingScheduleId(null); // Закриваємо форму після видалення
      toast.success("Заняття видалено з розкладу!");
    } catch (error) {
      console.error("Помилка:", error);
      toast.error("Сталася помилка при видаленні.");
    }
  };

  if (isLoadingSchedules) {
    return (
      <div className="my-30 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-gray-500">Формуємо графік занять...</p>
      </div>
    );
  }

  const fullSchedule = schedules
    .map((scheduleItem) => {
      const program = programs.find((prog) => prog.id === scheduleItem.lessonId);
      if (!program) return null;
      return { ...program, ...scheduleItem };
    })
    .filter((item) => item !== null);

  const displayDate = fullSchedule.length > 0 ? fullSchedule[0].date : newDate;
  const mainAgeGroups = ageGroups.filter((group) => !group.parentId);

  const eventsByAge = mainAgeGroups.map((group) => {
    const groupLessons = fullSchedule
      .filter((e) => e.ageGroupId === group.id)
      .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

    return {
      groupId: group.id,
      groupName: group.label,
      lessons: groupLessons,
    };
  });

  if (ageGroups.length === 0) return null;

  return (
    <div className="font-nunito my-30">
      <h2 className="text-preset-2 my-10 text-center font-semibold text-gray-700">
        Графік занять {displayDate}
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {eventsByAge.map(({ groupId, groupName, lessons }) => {
          const subGroups = ageGroups.filter((g) => g.parentId === groupId);
          const hasSubGroups = subGroups.length > 0;

          return (
            <div key={groupId} className="rounded-2xl bg-gray-50 p-6 shadow-lg">
              <h2 className="text-preset-3 text-Blue mb-4 text-center font-bold">
                Група {groupName}
              </h2>

              <div className={`grid gap-2 ${hasSubGroups ? "grid-cols-10" : "grid-cols-6"} `}>
                <div className="bg-LightSky shadow-card col-span-1 rounded-md p-2 text-center font-semibold md:col-span-2">
                  Час
                </div>

                {hasSubGroups ? (
                  <>
                    <div className="bg-LightSky shadow-card col-span-4 rounded-md p-2 text-center font-semibold">
                      {subGroups[0]?.subLabel || "Підгрупа 1"}
                    </div>
                    <div className="bg-LightSky shadow-card col-span-4 rounded-md p-2 text-center font-semibold">
                      {subGroups[1]?.subLabel || "Підгрупа 2"}
                    </div>
                  </>
                ) : (
                  <div className="bg-LightSky shadow-card col-span-4 rounded-md p-2 text-center font-semibold">
                    Назва заняття
                  </div>
                )}

                {lessons.length > 0 ? (
                  lessons.map((lesson, index) => {
                    const bgColor = COLORS[lesson.room as LessonColor] || COLORS.Yellow;

                    if (editingScheduleId === lesson.id) {
                      return (
                        <div key={lesson.id} className="col-span-6 mt-2">
                          <InlineScheduleForm
                            groupId={groupId}
                            groupName={groupName}
                            programs={programs}
                            ageGroups={ageGroups}
                            initialData={lesson}
                            onSave={(data) => handleSaveEdit(lesson.id, data)}
                            onCancel={() => setEditingScheduleId(null)}
                            onDelete={handleDeleteSchedule} // Передаємо функцію видалення
                          />
                        </div>
                      );
                    }

                    return (
                      <React.Fragment key={lesson.id || index}>
                        <div className="bg-LightSky shadow-card text-preset-6 col-span-1 flex flex-col justify-center rounded-md p-2 text-center md:col-span-2">
                          {lesson.timeStart}-{lesson.timeEnd}
                        </div>
                        <div
                          className="shadow-card group relative col-span-5 flex items-center justify-between rounded-md p-3 transition-all md:col-span-4"
                          style={{ backgroundColor: bgColor }}
                        >
                          {/* Інформація про заняття (по центру) */}
                          <div className="flex w-full flex-col items-center justify-center text-center">
                            <span className="text-preset-4 font-bold">{lesson.title}</span>

                            {lesson.level && (
                              <span className="text-preset-5 text-gray-800">({lesson.level})</span>
                            )}
                            {lesson.teacher && (
                              <span className="text-preset-6 mt-1 text-gray-700">
                                {lesson.teacher}
                              </span>
                            )}
                          </div>

                          {/* Кнопка редагування збоку (видно тільки адміну при наведенні або завжди) */}
                          {isAdmin && (
                            <button
                              onClick={() => setEditingScheduleId(lesson.id)}
                              className="ml-2 flex shrink-0 cursor-pointer items-center justify-center rounded-full p-2 text-gray-600 transition-colors hover:bg-white/50 hover:text-blue-600"
                              title="Редагувати"
                            >
                              <Pencil size={18} />
                            </button>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })
                ) : (
                  <div className="col-span-6 py-4 text-center text-sm text-gray-400">
                    Немає занять
                  </div>
                )}

                {isAdmin && (
                  <div className="col-span-6 mt-4">
                    {addingForGroup === groupId ? (
                      <InlineScheduleForm
                        groupId={groupId}
                        groupName={groupName}
                        programs={programs}
                        ageGroups={ageGroups}
                        onSave={(data) => handleSaveAdd(groupId, data)}
                        onCancel={() => setAddingForGroup(null)}
                      />
                    ) : (
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setAddingForGroup(groupId);
                            setEditingScheduleId(null);
                          }}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white"
                          title="Додати заняття"
                        >
                          <span className="text-2xl leading-none font-bold">+</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
