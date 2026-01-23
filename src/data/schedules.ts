import { nanoid } from "nanoid";

import type { LessonColor } from "./colors";
import type { ScheduleItem } from "../types/scheduleItem";

// Дата для прикладу (можна змінювати динамічно)
const SCHEDULE_DATE = "14.12.2025";

export const schedules: ScheduleItem[] = [
  // ==========================================
  // ГРУПА 3-5 РОКІВ (Верхній рядок)
  // ==========================================
  {
    id: nanoid(6),
    lessonId: "X7d9L2", // Українська мова (3-5)
    date: SCHEDULE_DATE,
    timeStart: "12:30",
    timeEnd: "13:20",
    room: "RoyalBlue" as LessonColor, // Синій блок
  },
  {
    id: nanoid(6),
    lessonId: "m3N5k8", // Танці під ялинку
    date: SCHEDULE_DATE,
    timeStart: "13:20",
    timeEnd: "14:00",
    room: "Violet" as LessonColor, // Фіолетовий блок
  },
  {
    id: nanoid(6),
    lessonId: "P2qR9s", // Kids Art (3-5)
    date: SCHEDULE_DATE,
    timeStart: "14:00",
    timeEnd: "14:50",
    room: "Violet" as LessonColor, // Фіолетовий блок
  },

  // ==========================================
  // ГРУПА 6-11 РОКІВ (Середні рядки)
  // ==========================================

  // --- Підгрупа 7-9 років ---
  {
    id: nanoid(6),
    lessonId: "vmg7ct", // LEGO
    date: SCHEDULE_DATE,
    timeStart: "13:20",
    timeEnd: "14:00",
    room: "GreenAccent" as LessonColor, // Зелений блок
    level: "7-9 років", // Уточнення з таблиці
  },
  {
    id: nanoid(6),
    lessonId: "6UQCx7", // Українська мова (6-11)
    date: SCHEDULE_DATE,
    timeStart: "14:00",
    timeEnd: "14:50",
    room: "RoyalBlue" as LessonColor, // Синій блок
    level: "7-9 років",
  },

  // --- Підгрупа 8-12 років ---
  {
    id: nanoid(6),
    lessonId: "6UQCx7", // Українська мова (6-11)
    date: SCHEDULE_DATE,
    timeStart: "13:20",
    timeEnd: "14:00",
    room: "RoyalBlue" as LessonColor, // Синій блок
    level: "8-12 років",
  },
  {
    id: nanoid(6),
    lessonId: "vmg7ct", // LEGO
    date: SCHEDULE_DATE,
    timeStart: "14:00",
    timeEnd: "14:50",
    room: "GreenAccent" as LessonColor, // Зелений блок
    level: "8-12 років",
  },

  // --- Спільні заняття 6-11 років ---
  {
    id: nanoid(6),
    lessonId: "H4jK9m", // Kids Art (6-11)
    date: SCHEDULE_DATE,
    timeStart: "14:50",
    timeEnd: "15:50",
    room: "GreenAccent" as LessonColor, // Зелений блок
  },
  {
    id: nanoid(6),
    lessonId: "z1X2c3", // Грай-тайм
    date: SCHEDULE_DATE,
    timeStart: "15:50",
    timeEnd: "16:50",
    room: "Violet" as LessonColor, // Фіолетовий блок
  },

  // ==========================================
  // ГРУПА 12-18 РОКІВ (Нижній рядок)
  // ==========================================
  {
    id: nanoid(6),
    lessonId: "Q8w9E0", // Українська мова (12-18)
    date: SCHEDULE_DATE,
    timeStart: "14:50", // Зсунуто відносно сітки 14:00
    timeEnd: "15:40",
    room: "RoyalBlue" as LessonColor, // Синій блок
  },
  {
    id: nanoid(6),
    lessonId: "R4t5Y6", // Kids Art (12-18)
    date: SCHEDULE_DATE,
    timeStart: "15:50",
    timeEnd: "17:10", // Довге заняття згідно сітки
    room: "GreenAccent" as LessonColor, // Зелений блок
  },
  {
    id: nanoid(6),
    lessonId: "U7i8O9", // Тінейджер клуб
    date: SCHEDULE_DATE,
    timeStart: "17:10",
    timeEnd: "18:00",
    room: "GreenAccent" as LessonColor, // Зелений блок
  },
];
