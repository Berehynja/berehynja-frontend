import React from "react";
import { lessons } from "../../data/lessons";
import { COLORS } from "../../data/colors";

export function ScheduleCalendar() {

    const lessonsByAgeGroup = {
  "3-5": lessons.filter(l => l.ageGroup === "3-5").sort((a, b) => a.timeStart.localeCompare(b.timeStart)),
  "6-11": lessons.filter(l => l.ageGroup === "6-11").sort((a, b) => a.timeStart.localeCompare(b.timeStart)),
  "12-18": lessons.filter(l => l.ageGroup === "12-18").sort((a, b) => a.timeStart.localeCompare(b.timeStart))
};


  return (
  <div className="grid grid-cols-3 gap-6">
    {Object.entries(lessonsByAgeGroup).map(([ageGroup, groupLessons]) => (
      <div key={ageGroup} className="rounded-lg shadow-lg p-6">
        <h2 className="text-preset-3 text-RoyalBlue text-center font-bold mb-4">Група {groupLessons[0].ageLabel}</h2>
        
        <div className="grid grid-cols-4 gap-2">
          {/* Заголовки */}
          <div className="bg-Sky p-2 text-center font-semibold">Час</div>
          <div className="bg-Sky p-2 text-center font-semibold col-span-2">Назва заняття</div>
          <div className="bg-Sky p-2 text-center font-semibold">Кімната</div>
          
          {/* Заняття */}
          {groupLessons.map(lesson => (
            <React.Fragment key={lesson.id}>
              <div className="bg-Sky p-2 text-center">{lesson.timeStart}-{lesson.timeEnd}</div>
              <div className="p-2 text-center col-span-2">{lesson.title}</div>
              <div className="p-2" style={{ backgroundColor: COLORS[lesson.room] }}></div>
            </React.Fragment>
          ))}
        </div>
      </div>
    ))}
  </div>
);
}
