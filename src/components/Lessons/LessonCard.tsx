import { Sparkles } from "lucide-react"; // Імпортуємо дефолтну іконку як компонент
import { COLOR_STYLES } from "../../constants/colorStyles";
import { AVAILABLE_ICONS } from "../../data/icons";
// 👇 Бажано використовувати тип Program, бо в ньому точно є iconName
import type { Program } from "../../types/program";
import { Pencil } from "lucide-react";
import { useAuth } from "../AuthProvider/useAuth";

interface LessonCardProps {
  lesson: Program;
  onEdit?: (program: Program) => void;
}

export function LessonCard({ lesson, onEdit }: LessonCardProps) {
  // 1. Визначаємо стиль (колір)
  const style = COLOR_STYLES[lesson.color] || COLOR_STYLES.RoyalBlue;

  // 2. Визначаємо іконку
  // Шукаємо в реєстрі по імені. Якщо немає — беремо Sparkles (компонент)
  const IconComponent = AVAILABLE_ICONS[lesson.iconName] || Sparkles;

  const { isAdmin } = useAuth();

  return (
    <div
      className={`flex aspect-10/9 w-full flex-col items-center justify-center gap-4 rounded-3xl bg-linear-to-br p-4 sm:aspect-square ${style.gradient} shadow-lg ${style.shadow} group relative transform cursor-pointer transition-all duration-300 select-none hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl`}
    >
      {/* Кружечок під іконку */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/20 shadow-inner backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
        <IconComponent className="h-8 w-8 text-white" strokeWidth={2} />
      </div>

      {/* КНОПКА РЕДАГУВАННЯ */}
      {isAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit(lesson);
          }}
          className="absolute top-2 right-2 cursor-pointer rounded-full p-3 text-white outline-1 outline-white/60 transition-all duration-300 hover:text-gray-300 hover:outline-gray-300/70"
        >
          <Pencil size={24} />
        </button>
      )}

      {/* Назва */}
      <h3 className="text-preset-3 text-center text-lg leading-tight font-bold text-white drop-shadow-sm md:text-xl">
        {lesson.title}
      </h3>
    </div>
  );
}
