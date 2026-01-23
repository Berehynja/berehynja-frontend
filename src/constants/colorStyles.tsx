import type { LessonColor } from "../data/colors";

// Тип для стилю (щоб TS підказував поля)
export type ColorStyle = {
  gradient: string; // Класи градієнту
  shadow: string;
  text: string; // Колір тексту (для додаткових елементів)
};

export const COLOR_STYLES: Record<LessonColor, ColorStyle> = {
  RoyalBlue: {
    gradient: `from-RoyalBlue to-blue-600`,
    shadow: `shadow-RoyalBlue/50`,
    text: `text-RoyalBlue`,
  },
  // === 2. Rose (Замість dance) ===
  Rose: {
    gradient: `from-Rose to-pink-600`,
    shadow: `shadow-Rose/50`,
    text: `text-Rose`,
  },

  // === 3. Violet (Замість art) ===
  Violet: {
    gradient: `from-Violet to-purple-600`,
    shadow: `shadow-Violet/50`,
    text: `text-Violet`,
  },

  // === 4. Red (Замість lego) ===
  Red: {
    gradient: `from-Red to-red-700`,
    shadow: `shadow-Red/50`,
    text: `text-Red`,
  },

  // === 5. Sand (Замість play/grai-time) ===
  Sand: {
    gradient: `from-Sand to-amber-500`,
    shadow: `shadow-Sand/50`,
    text: `text-Sand`,
  },

  // === 6. GreenAccent (Замість theatre) ===
  GreenAccent: {
    gradient: `from-GreenAccent to-green-600`,
    shadow: `shadow-GreenAccent/50`,
    text: `text-GreenAccent`,
  },

  // === 7. Sky (Додатковий) ===
  Sky: {
    gradient: `from-Sky to-sky-600`,
    shadow: `shadow-Sky/50`,
    text: `text-Sky`,
  },

  // === 8. LightSky (Додатковий) ===
  LightSky: {
    gradient: `from-LightSky to-sky-400`,
    shadow: `shadow-LightSky/50`,
    text: `text-LightSky`,
  },

  // === 9. Sage (Додатковий) ===
  Sage: {
    gradient: `from-Sage to-emerald-600`,
    shadow: `shadow-Sage/50`,
    text: `text-Sage`,
  },

  // === 10. White (Нейтральний) ===
  White: {
    gradient: "from-gray-100 to-gray-300",
    shadow: "shadow-gray-200/50",
    text: "text-gray-500",
  },
};
