import { useMemo } from "react";
import { lessons } from "../../data/lessons";
import { LessonCard } from "./LessonCard";

export function LessonsGrid(){
    const uniqueLessons = useMemo(() => {
        return [... new Map(lessons.map((lesson) => [lesson.title, lesson])).values()];
    }, [])


    return(
        <div className="mt-10 mb-25">
            <h2 className="text-preset-2 my-8 text-gray-700 font-bold text-center">Програми</h2>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {uniqueLessons.map((lesson) => (
                    <LessonCard key={lesson.id} lesson={lesson}/>
                ))}
            </div>
        </div>
    )
}