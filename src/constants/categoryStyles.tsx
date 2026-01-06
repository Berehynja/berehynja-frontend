import { 
  BookOpen, 
  Music, 
  Palette, 
  Blocks, 
  Smile, 
  Drama, 
  Users, 
  Sparkles 
} from "lucide-react";

// Тип для стилю (щоб TS підказував поля)
export type CategoryStyle = {
  icon: React.ElementType; // Тип для компонента іконки
  gradient: string;        // Класи градієнту
  shadow: string;          // Клас тіні
};

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  language: { 
    icon: BookOpen, 
    gradient: "from-blue-400 to-blue-600", 
    shadow: "shadow-blue-300" 
  },
  dance: { 
    icon: Music, 
    gradient: "from-pink-400 to-pink-600", 
    shadow: "shadow-pink-300" 
  },
  art: { 
    icon: Palette, 
    gradient: "from-purple-400 to-purple-600", 
    shadow: "shadow-purple-300" 
  },
  lego: { 
    icon: Blocks, 
    gradient: "from-red-400 to-red-600", 
    shadow: "shadow-red-300" 
  },
  play: { 
    icon: Smile, 
    gradient: "from-yellow-400 to-yellow-600", 
    shadow: "shadow-yellow-300" 
  },
  theatre: { 
    icon: Drama, 
    gradient: "from-green-400 to-green-600", 
    shadow: "shadow-green-300" 
  },
  club: { 
    icon: Users, 
    gradient: "from-indigo-400 to-indigo-600", 
    shadow: "shadow-indigo-300" 
  },
  // Стиль за замовчуванням (якщо категорія не знайдена)
  default: { 
    icon: Sparkles, 
    gradient: "from-gray-400 to-gray-600", 
    shadow: "shadow-gray-300" 
  }
};