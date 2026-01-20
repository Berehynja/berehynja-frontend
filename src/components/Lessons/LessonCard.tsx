import { Sparkles } from "lucide-react"; // Імпортуємо дефолтну іконку як компонент
import { COLOR_STYLES } from "../../constants/colorStyles";
import { AVAILABLE_ICONS } from "../../data/icons";
// 👇 Бажано використовувати тип Program, бо в ньому точно є iconName
import type { Program } from "../../types/program"; 

interface LessonCardProps {
    lesson: Program; // Якщо у вас ще Lesson, замініть на Lesson, але переконайтесь що там є iconName
}

export function LessonCard({ lesson }: LessonCardProps) {
    // 1. Визначаємо стиль (колір)
    const style = COLOR_STYLES[lesson.color] || COLOR_STYLES.RoyalBlue;

    // 2. Визначаємо іконку
    // Шукаємо в реєстрі по імені. Якщо немає — беремо Sparkles (компонент)
    const IconComponent = AVAILABLE_ICONS[lesson.iconName] || Sparkles;

    return (
        <div 
            className={`
                /* Розміри та форма (Квадратна картка) */
                w-full aspect-10/9 sm:aspect-square 
                rounded-3xl p-4
                
                /* Вирівнювання */
                flex flex-col items-center justify-center gap-4
                
                /* Кольори та тіні з вашого файлу стилів */
                bg-linear-to-br ${style.gradient} 
                shadow-lg ${style.shadow}
                
                /* Анімація */
                transform transition-all duration-300 
                hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02]
                cursor-pointer group select-none
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