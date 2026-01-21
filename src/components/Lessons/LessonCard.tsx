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

    const {isAdmin} = useAuth();

    return (
        <div 
            className={`
                w-full aspect-10/9 sm:aspect-square 
                rounded-3xl p-4
                flex flex-col items-center justify-center gap-4
                bg-linear-to-br ${style.gradient} 
                shadow-lg ${style.shadow}
                transform transition-all duration-300 
                hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02]
                cursor-pointer group select-none
                relative
            `} 
        >
            {/* Кружечок під іконку */}
            <div className="
                w-16 h-16 rounded-full 
                bg-white/20 backdrop-blur-sm 
                flex items-center justify-center
                border border-white/20 shadow-inner
                group-hover:scale-110 transition-transform duration-300
            ">
                <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
            </div>

{       /* КНОПКА РЕДАГУВАННЯ */}
        {isAdmin && (
                        <button
                        onClick={(e) =>{
                            e.stopPropagation();
                            if(onEdit) onEdit(lesson);
                        } }
                        className="
                        absolute top-2 right-2
                        p-3 rounded-full

                                transition-all duration-300
                         cursor-pointer
                                text-white hover:text-gray-300
                                outline-1 outline-white/60 hover:outline-gray-300/70
                        "
                        >
                        <Pencil size={24}/>
                        </button>
                    )}

            {/* Назва */}
            <h3 className="
               text-preset-3 text-white font-bold text-center text-lg md:text-xl 
                drop-shadow-sm leading-tight
            ">
                {lesson.title}
            </h3>
        </div>
    );
}