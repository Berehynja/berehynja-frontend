import React from "react";
import { lessons } from "../../data/lessons";
import { schedules } from "../../data/schedules";

export function ScheduleCalendar() {
    const fullSchedule = schedules.map((scheduleItem) => {

        const lesson = lessons.find((less) => less.id === scheduleItem.lessonId)
        
        if(!lesson) return null;
        
        return {
            ...lesson, // title, ageGroup
            ...scheduleItem, // timeStart, timeEnd, room, date, level
        };
        
      
    }).filter((item) => item !== null)

    const displayDate = fullSchedule.length > 0 ? fullSchedule[0].date : "";

    const eventsByAge = {
  "3-5": fullSchedule.filter(e => e.ageGroup === "3-5").sort((a, b) => a.timeStart.localeCompare(b.timeStart)),
  "6-11": fullSchedule.filter(e => e.ageGroup === "6-11").sort((a, b) => a.timeStart.localeCompare(b.timeStart)),
  "12-18": fullSchedule.filter(e => e.ageGroup === "12-18").sort((a, b) => a.timeStart.localeCompare(b.timeStart))
};

  return (
    <div className="my-30">
 <h2 className="text-preset-2 my-10 text-center text-gray-700 font-semibold">Графік занять {displayDate}</h2>
   <div className="grid grid-cols-3 gap-6">
    {Object.entries(eventsByAge).map(([ageGroup, groupLessons]) => (
      <div key={ageGroup} className="rounded-lg shadow-lg p-6 bg-gray-50">
        <h2 className="text-preset-3 text-Blue text-center font-bold mb-4">Група {ageGroup} років</h2>
        
        <div className="grid grid-cols-4 gap-2">
          {/* Заголовки */}
          <div className="bg-LightSky p-2 text-center font-semibold">Час</div>
          <div className="bg-LightSky p-2 text-center font-semibold col-span-2">Назва заняття</div>
          <div className="bg-LightSky p-2 text-center font-semibold">Кімната</div>
          
          {/* Заняття */}
          {groupLessons.map(lesson => (
              <React.Fragment key={lesson.id}>
              <div className="bg-LightSky p-2 text-center flex flex-col justify-center">{lesson.timeStart}-{lesson.timeEnd}</div>
              <div className="p-2 text-center flex flex-col justify-center col-span-2">{lesson.title}
              {lesson.level ? <p className="text-preset-5">({lesson.level})</p> : null}

              </div>
              <div className={`p-2 bg-${lesson.room}`}></div>
            </React.Fragment>
          ))}
        </div>
      </div>
    ))}
  </div>
   </div>
);
}
