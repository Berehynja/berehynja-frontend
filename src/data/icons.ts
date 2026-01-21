import { 
  BookOpen, Music, Palette, Blocks, Smile, 
  Drama, Users, Sparkles, Cloud, Leaf, 
  Calculator, Globe, Microscope, Cpu, Trophy
} from "lucide-react";

// Реєстр доступних іконок
// Ключ = назва, яка збережеться в базу
// Значення = компонент React
export const AVAILABLE_ICONS = {
  book: BookOpen,
  music: Music,
  palette: Palette,
  blocks: Blocks,
  smile: Smile,
  drama: Drama,
  users: Users,
  sparkles: Sparkles,
  cloud: Cloud,
  leaf: Leaf,
  math: Calculator,
  globe: Globe,
  science: Microscope,
  tech: Cpu,
  winner: Trophy
} as const;

export type IconName = keyof typeof AVAILABLE_ICONS;