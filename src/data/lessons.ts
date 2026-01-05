import type { Lesson } from "../types/lesson";
import type { LessonColor } from "./colors";

export const lessons: Lesson[] = [
  // ===== 3–5 років =====
  {
    id: "3-5-01",
    title: "Українська мова (Нульовий рівень 5-6 років)",
    category: "language",
    ageGroup: "3-5",
    ageLabel: "3-5 років",
    color: "Sage" as LessonColor,
    date: "2025-12-07",
    timeStart: "12:40",
    timeEnd: "13:20",
    room: "GreenAccent" as LessonColor
  },
  {
    id: "3-5-02",
    title: "Танці під ялинку",
    category: "dance",
    ageGroup: "3-5",
    ageLabel: "3-5 років",
    color: "Sage" as LessonColor,
    date: "2025-12-07",
    timeStart: "13:30",
    timeEnd: "14:00",
    room: "Violet" as LessonColor
  },
  {
    id: "3-5-03",
    title: "Kids Art",
    category: "art",
    ageGroup: "3-5",
    ageLabel: "3-5 років",
    color: "Sage" as LessonColor,
    date: "2025-12-07",
    timeStart: "14:00",
    timeEnd: "14:40",
    room: "Violet" as LessonColor
  },

  // ===== 6-11 років =====
  {
    id: "6-11-01",
    title: "LEGO",
    category: "lego",
    ageGroup: "6-11",
    ageLabel: "6-11 років",
    color: "RoyalBlue" as LessonColor,
    level: "7-9 років",
    date: "2025-12-07",
    timeStart: "13:20",
    timeEnd: "14:00",
    room: "RoyalBlue" as LessonColor
  },
  {
    id: "6-11-02",
    title: "Українська мова",
    category: "language",
    ageGroup: "6-11",
    ageLabel: "6-11 років",
    color: "RoyalBlue" as LessonColor,
    level: "8-12 років",
    date: "2025-12-07",
    timeStart: "14:10",
    timeEnd: "14:50",
    room: "GreenAccent" as LessonColor
  },
  {
    id: "6-11-03",
    title: "Kids Art",
    category: "art",
    ageGroup: "6-11",
    ageLabel: "6-11 років",
    color: "RoyalBlue" as LessonColor,
    date: "2025-12-07",
    timeStart: "15:00",
    timeEnd: "15:50",
    room: "Red" as LessonColor
  },
  {
    id: "6-11-04",
    title: "Грай-тайм",
    category: "play",
    ageGroup: "6-11",
    ageLabel: "6-11 років",
    color: "RoyalBlue" as LessonColor,
    date: "2025-12-07",
    timeStart: "16:00",
    timeEnd: "16:50",
    room: "Red" as LessonColor
  },
  {
    id: "6-11-05",
    title: "Театр",
    category: "theatre",
    ageGroup: "6-11",
    ageLabel: "6-11 років",
    color: "RoyalBlue" as LessonColor,
    date: "2025-12-07",
    timeStart: "17:00",
    timeEnd: "18:00",
    room: "RoyalBlue" as LessonColor
  },

  // ===== 12-18 років =====
  {
    id: "12-18-01",
    title: "Українська мова Просунутий рівень",
    category: "language",
    ageGroup: "12-18",
    ageLabel: "12-18 років",
    color: "Red" as LessonColor,
    level: "Просунутий",
    date: "2025-12-07",
    timeStart: "15:00",
    timeEnd: "15:40",
    room: "GreenAccent" as LessonColor
  },
  {
    id: "12-18-02",
    title: "Kids Art",
    category: "art",
    ageGroup: "12-18",
    ageLabel: "12-18 років",
    color: "Red" as LessonColor,
    date: "2025-12-07",
    timeStart: "16:00",
    timeEnd: "17:00",
    room: "GreenAccent" as LessonColor
  },
  {
    id: "12-18-03",
    title: "Тінейджер клуб",
    category: "club",
    ageGroup: "12-18",
    ageLabel: "12-18 років",
    color: "Red" as LessonColor,
    date: "2025-12-07",
    timeStart: "17:00",
    timeEnd: "18:00",
    room: "Red" as LessonColor
  },
  {
    id: "12-18-04",
    title: "Театр",
    category: "theatre",
    ageGroup: "12-18",
    ageLabel: "12-18 років",
    color: "Red" as LessonColor,
    date: "2025-12-07",
    timeStart: "18:00",
    timeEnd: "19:30",
    room: "RoyalBlue" as LessonColor
  }
];
