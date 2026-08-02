import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../AuthProvider/useAuth";
import { PageLoader } from "../../ui/PageLoader";
import { COLORS, type LessonColor } from "../../../data/colors";
import type { Program } from "../../../types/program";
import type { AgeGroup } from "../../../types/ageGroup";
import type { ScheduleItem } from "../../../types/scheduleItem";
import { scheduleService } from "../../../services/scheduleService";
import { getNextSundayDate } from "../../../utils/dateUtils";
import {
  InlineScheduleForm,
  type ScheduleFormData,
} from "./InlineScheduleForm";

interface ScheduleCalendarProps {
  programs: Program[];
  ageGroups: AgeGroup[];
  onLoadingChange?: (isLoading: boolean) => void;
}

export function ScheduleCalendar({
  programs,
  ageGroups,
  onLoadingChange,
}: ScheduleCalendarProps) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAdmin } = useAuth();
  const { t, i18n } = useTranslation();
  const [addingForGroup, setAddingForGroup] = useState<string | null>(null);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  const newDate = getNextSundayDate();

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoadingSchedules(true);
      onLoadingChange?.(true);

      try {
        const data = await scheduleService.getSchedules();
        setSchedules(data);
      } catch (error) {
        console.error("Помилка при завантаженні розкладу:", error);
      } finally {
        setIsLoadingSchedules(false);
        onLoadingChange?.(false);
      }
    };
    fetchSchedules();
  }, [onLoadingChange]);

  const handleSaveAdd = async (groupId: string, data: ScheduleFormData) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const newScheduleData = { ...data, ageGroupId: groupId, date: newDate };
      const addedSchedule = await scheduleService.addSchedule(newScheduleData);
      setSchedules((prev) => [...prev, addedSchedule as ScheduleItem]);
      setAddingForGroup(null);
      toast.success("Заняття додано до розкладу!");
    } catch (error) {
      console.error("Помилка:", error);
      toast.error("Помилка при збереженні.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEdit = async (scheduleId: string, data: ScheduleFormData) => {
    if (isProcessing) return;
    setIsProcessing(true);

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
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string, title: string) => {
    if (isProcessing) return;
    const confirmDelete = window.confirm(`Ви точно хочете видалити заняття "${title}" з розкладу?`);
    if (!confirmDelete) return;

    setIsProcessing(true);
    try {
      await scheduleService.deleteSchedule(scheduleId);
      setSchedules((prev) => prev.filter((sch) => sch.id !== scheduleId));
      setEditingScheduleId(null); // Закриваємо форму після видалення
      toast.success("Заняття видалено з розкладу!");
    } catch (error) {
      console.error("Помилка:", error);
      toast.error("Сталася помилка при видаленні.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingSchedules) return null;

  const fullSchedule = schedules
    .map((scheduleItem) => {
      const program = programs.find((prog) => prog.id === scheduleItem.lessonId);
      if (!program) return null;
      return { ...program, ...scheduleItem };
    })
    .filter(
      (item): item is NonNullable<typeof item> => item !== null,
    );

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
    <div className="font-nunito">
      <PageLoader visible={isProcessing} />
      <h2 className="text-preset-2 my-10 text-center font-semibold text-gray-700">
        {t("programs.kids.schedule")} {displayDate}
      </h2>

      <div className="grid gap-6 xl:grid-cols-4">
        {eventsByAge.map(({ groupId, groupName, lessons }) => {
          const subGroups = ageGroups.filter((g) => g.parentId === groupId);
          const hasSubGroups = subGroups.length > 0;

          // 1. Групуємо заняття за унікальним часовим слотом
          const timeSlots = lessons.reduce(
            (acc, lesson) => {
              const slot = `${lesson.timeStart}-${lesson.timeEnd}`;
              if (!acc[slot]) acc[slot] = [];
              acc[slot].push(lesson);
              return acc;
            },
            {} as Record<string, (typeof fullSchedule)[number][]>
          );

          // 2. Отримуємо відсортовані ключі часу (щоб розклад йшов по порядку)
          const sortedSlots = Object.keys(timeSlots).sort();

          return (
            <div
              key={groupId}
              className={`rounded-2xl bg-gray-50 p-6 shadow-lg ${
                hasSubGroups ? "xl:col-span-2" : "xl:col-span-1"
              }`}
            >
              <h2 className="text-preset-3 text-Blue mb-4 text-center font-bold">
                {t("programs.kids.groups")} {groupName}
              </h2>

              <div className={`grid gap-2 ${hasSubGroups ? "grid-cols-10" : "grid-cols-6"} `}>
                <div className="bg-LightSky shadow-card col-span-2 flex flex-col justify-center rounded-md p-2 text-center font-semibold">
                  {t("programs.kids.time")}
                </div>

                {hasSubGroups ? (
                  <div className="col-span-8 gap-2">
                    <div className="bg-LightSky shadow-card col-span-4 rounded-md p-2 text-center font-semibold">
                      {t("programs.kids.lessonName")}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="bg-LightSky shadow-card rounded-md p-2 text-center font-semibold">
                        {t("programs.kids.initial1")} {subGroups[0]?.subLabel || "Підгрупа 1"}
                      </div>
                      <div className="bg-LightSky shadow-card rounded-md p-2 text-center font-semibold">
                        {t("programs.kids.initial2")} {subGroups[1]?.subLabel || "Підгрупа 2"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-LightSky shadow-card col-span-4 rounded-md p-2 text-center font-semibold">
                    {t("programs.kids.lessonName")}
                  </div>
                )}

                {sortedSlots.length > 0 ? (
                  sortedSlots.map((slot) => {
                    const slotLessons = timeSlots[slot];

                    return (
                      <React.Fragment key={slot}>
                        {/* ОДНА клітинка з часом на весь рядок */}
                        <div className="bg-LightSky shadow-card text-preset-6 col-span-2 flex flex-col justify-center rounded-md p-2 text-center font-bold">
                          {slot}
                        </div>

                        {/* ПРАВА ЧАСТИНА: контейнер для занять */}
                        <div
                          className={`${hasSubGroups ? "col-span-8" : "col-span-4"} grid gap-2 ${hasSubGroups ? "grid-cols-2" : "grid-cols-1"}`}
                        >
                          {slotLessons.map((lesson) => {
                            const bgColor = COLORS[lesson.room as LessonColor] || COLORS.Yellow;

                            if (editingScheduleId === lesson.id) {
                              return (
                                <div key={lesson.id} className="col-span-full">
                                  <InlineScheduleForm
                                    groupId={groupId}
                                    groupName={groupName}
                                    programs={programs}
                                    ageGroups={ageGroups}
                                    initialData={lesson}
                                    onSave={(data) => handleSaveEdit(lesson.id, data)}
                                    onCancel={() => setEditingScheduleId(null)}
                                    onDelete={handleDeleteSchedule}
                                  />
                                </div>
                              );
                            }

                            // === ЛОГІКА МАГНІТНИХ КОЛОНОК ===
                            const isFullWidth = !hasSubGroups || !lesson.subGroupId;

                            let gridColumnClass = "col-span-full"; // за замовчуванням на всю ширину

                            if (!isFullWidth && hasSubGroups) {
                              // Знаходимо, чи це перша підгрупа чи друга
                              const subGroupIndex = subGroups.findIndex(
                                (sg) => sg.id === lesson.subGroupId
                              );

                              // Якщо індекс 0 (7-9 років) -> col-start-1
                              // Якщо індекс 1 (8-12 років) -> col-start-2
                              gridColumnClass =
                                subGroupIndex === 1
                                  ? "col-span-1 col-start-2"
                                  : "col-span-1 col-start-1";
                            }

                            return (
                              <div
                                key={lesson.id}
                                className={`shadow-card group relative flex items-center justify-between rounded-md p-3 transition-all ${gridColumnClass}`}
                                style={{ backgroundColor: bgColor }}
                              >
                                <div className="flex w-full flex-col items-center justify-center text-center">
                                  <span className="text-preset-4 font-nunito leading-tight font-bold">
                                    {typeof lesson.title === "string"
                                      ? lesson.title
                                      : lesson.title[
                                          i18n.language as keyof typeof lesson.title
                                        ] || lesson.title.ua}
                                  </span>{" "}
                                  {lesson.level && (
                                    <span className="text-preset-5 text-gray-800">
                                      ({lesson.level})
                                    </span>
                                  )}
                                  {lesson.teacher && (
                                    <span className="text-preset-5 mt-1 w-full pt-1 text-gray-100">
                                      {lesson.teacher}
                                    </span>
                                  )}
                                </div>

                                {isAdmin && (
                                  <button
                                    type="button"
                                    onClick={() => setEditingScheduleId(lesson.id)}
                                    aria-label="Редагувати заняття"
                                    title="Редагувати заняття"
                                    className="ml-2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-600 shadow-sm transition-all hover:border-blue-300 hover:bg-white hover:text-blue-600 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                )}
                              </div>
                            );
                          })}
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
                  <div className="col-span-full mt-4">
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
                          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white"
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
