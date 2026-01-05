import { lessons } from "../../data/lessons";
import { LessonCard } from "./LessonCard";

export function LessonsGrid(){
    return(
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson}/>
            ))}
        </div>
    )
}