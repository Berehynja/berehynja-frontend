import type { LessonColor } from "../data/colors";

export type AgeGroupKey = "3-5" | "6-11" | "12-18";

export interface Lesson {
  id: string;
  title: string;
  category: LessonCategory;
  ageGroup: AgeGroupKey;
  ageSubgroup?: string;
  level?: string;

  ageLabel?: string;
  color?: LessonColor;
  date?: string; // ISO: YYYY-MM-DD
  timeStart?: string; // HH:mm
  timeEnd?: string; // HH:mm
  room?: LessonColor;
}

export type LessonCategory = "language" | "art" | "lego" | "dance" | "play" | "theatre" | "club";
