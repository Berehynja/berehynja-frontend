import type { LessonColor } from "../data/colors";
import type { IconName } from "../data/icons";

export interface Program {
  id: string;
  title: string;
  description?: string;
  color: LessonColor;

  // Зв'язок з віковими групами (зберігаємо тільки ID)
  ageGroupIds: string[];

  iconName: IconName;
}

export interface ProgramAdults {
  id: string;
  image: string;
  dateRange: string; // Залишаємо рядком, бо це зазвичай просто цифри (15.05 - 25.05)
  
  // Поля з підтримкою трьох мов
  title: {
    ua: string;
    de: string;
    en: string;
  };
  // Короткий опис для картки
  descriptions: {
    ua: string;
    de: string;
    en: string;
  };
  // Повний опис для детальної сторінки
  fullDescription?: {
    ua: string;
    de: string;
    en: string;
  };
  duration: {
    ua: string;
    de: string;
    en: string;
  };
  intensity: {
    ua: string;
    de: string;
    en: string;
  };
  target: {
    ua: string;
    de: string;
    en: string;
  };
  capacity: {
    ua: string;
    de: string;
    en: string;
  };
  location: {
    ua: string;
    de: string;
    en: string;
  };

  features?: {
    ua: string[];
    de: string[];
    en: string[];
  };
}