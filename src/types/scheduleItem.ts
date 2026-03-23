import type { LessonColor } from "../data/colors";

export interface ScheduleItem {
  id: string;
  lessonId: string;
  ageGroupId: string;

  date: string;
  timeStart: string;
  timeEnd: string;
  room: LessonColor;

  level?: string;   
  teacher?: string;
}
