// colors.ts
export const COLORS = {
  RoyalBlue: "#01b0f1",
  Sky: "#6ED0F0",
  LightSky: "#C1DDEF",
  Sage: "#A4C9A0",
  GreenAccent: "#9ACD32",
  Rose: "#DF7D84",
  Red: "#FF5A5A",
  Violet: "#8E44AD",
  Sand: "#E2CD7A",
  White: "#FFFFFF",

} as const;

// Функція для конвертації HEX у RGBA з заданою прозорістю
function hexToRgba(hex: string, alpha: number) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Версія кольорів з 30% прозорістю
export const COLORS_ALPHA_30: Record<keyof typeof COLORS, string> = Object.fromEntries(
  Object.entries(COLORS).map(([key, value]) => [key, hexToRgba(value, 0.3)])
) as Record<keyof typeof COLORS, string>;

export type LessonColor = keyof typeof COLORS;
