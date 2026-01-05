import { COLORS_ALPHA_30 } from "../../data/colors"
import type { Lesson } from "../../types/lesson"

export function LessonCard({lesson}: {lesson:Lesson}){
    return(
        <div className="rounded-lg p-4 shadow-md flex flex-col" style={{ backgroundColor: COLORS_ALPHA_30[lesson.color] }} >
            <h3 className="text-preset-3 mb-2 flex-1 flex items-start justify-left">{lesson.title}</h3>
            <p className="text-preset-5 mb-1">{lesson.ageLabel}</p>
            <p className="text-preset-5 mb-1">{lesson.timeStart} - {lesson.timeEnd}</p>
        </div>
    )
}