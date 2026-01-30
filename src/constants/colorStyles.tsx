import type { LessonColor } from "../data/colors";

// Тип для стилю
export type ColorStyle = {
  gradient: string;
  shadow: string;
  text: string;
};

export const COLOR_STYLES: Record<LessonColor, ColorStyle> = {
  RoyalBlue: {
    gradient: `from-RoyalBlue to-blue-600`,
    shadow: `shadow-RoyalBlue/50`,
    text: `text-RoyalBlue`,
  },
  Blue: {
    gradient: `from-Blue to-blue-700`, // Новий стиль для простого blue
    shadow: `shadow-Blue/50`,
    text: `text-Blue`,
  },
  Sky: {
    gradient: `from-Sky to-sky-600`,
    shadow: `shadow-Sky/50`,
    text: `text-Sky`,
  },
  LightSky: {
    gradient: `from-LightSky to-sky-400`,
    shadow: `shadow-LightSky/50`,
    text: `text-LightSky`,
  },
  GreenAccent: {
    gradient: `from-GreenAccent to-green-600`,
    shadow: `shadow-GreenAccent/50`,
    text: `text-GreenAccent`,
  },
  Green: {
    gradient: `from-Green to-emerald-500`,
    shadow: `shadow-Green/50`,
    text: `text-Green`,
  },
  Rose: {
    gradient: `from-Rose to-pink-600`,
    shadow: `shadow-Rose/50`,
    text: `text-Rose`,
  },
  Red: {
    gradient: `from-Red to-red-700`,
    shadow: `shadow-Red/50`,
    text: `text-Red`,
  },
  Pink: {
    gradient: `from-Pink to-pink-600`,
    shadow: `shadow-Pink/50`,
    text: `text-Pink`,
  },
  Violet: {
    gradient: `from-Violet to-purple-600`,
    shadow: `shadow-Violet/50`,
    text: `text-Violet`,
  },
  Orange: {
    gradient: `from-Orange to-orange-600`,
    shadow: `shadow-Orange/50`,
    text: `text-Orange`,
  },
  Yellow: {
    gradient: `from-Yellow to-yellow-500`,
    shadow: `shadow-Yellow/50`,
    text: `text-Yellow`,
  },
};
