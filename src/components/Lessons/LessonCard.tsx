
import { CATEGORY_STYLES } from "../../constants/categoryStyles"
import type { Lesson } from "../../types/lesson"

export function LessonCard({lesson}:{lesson:Lesson}){
    const style = CATEGORY_STYLES[lesson.category] || CATEGORY_STYLES.default;
    const IconComponent = style.icon;

    return(
        <div className={`rounded-lg py-10 px-6 shadow-lg flex flex-col items-center gap-4 bg-linear-to-br ${style.gradient} ${style.shadow} transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
            cursor-pointer`} >
                {/* 2. Іконка в білому напівпрозорому кружечку */}
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-inner border border-white/30">
                <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-preset-3 font-bold text-white text-center">{lesson.title}</h3>
        </div>
    )

  
}
