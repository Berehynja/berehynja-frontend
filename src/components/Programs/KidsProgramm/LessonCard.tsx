import { useState } from "react";
import { Sparkles, Pencil, X, AlignLeft } from "lucide-react";
import { COLOR_STYLES } from "../../../constants/colorStyles";
import { AVAILABLE_ICONS } from "../../../data/icons";
import type { Program } from "../../../types/program";
import { useAuth } from "../../AuthProvider/useAuth";

interface LessonCardProps {
  lesson: Program;
  onEdit?: (program: Program) => void;
}

export function LessonCard({ lesson, onEdit }: LessonCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const style = COLOR_STYLES[lesson.color] || COLOR_STYLES.RoyalBlue;
  const IconComponent = AVAILABLE_ICONS[lesson.iconName] || Sparkles;
  const { isAdmin } = useAuth();

  return (
    <>
      {/* КАРТКА З ПОВЕРНУТИМИ КОЛЬОРОВИМИ ТІНЯМИ */}
      <div
        onClick={() => setIsModalOpen(true)}
        className={`group relative flex aspect-square w-full transform cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[2.5rem] transition-all duration-300 select-none 
        shadow-lg ${style.shadow} hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl`}
      >
        {/* 🖼️ ФОНОВЕ ЗОБРАЖЕННЯ */}
        {lesson.image ? (
          <img 
            src={lesson.image} 
            alt={lesson.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className={`absolute inset-0 h-full w-full bg-linear-to-br ${style.gradient}`} />
        )}

        {/* 🌑 ЛЕГКИЙ ОВЕРЛЕЙ */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />

        {/* 💫 КОНТЕНТ */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-between py-8">
          <div className="flex flex-1 items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-xl backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30">
              <IconComponent className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* 🏷️ НАЗВА НА ТЕМНОМУ ТЛІ */}
          <div className="w-[85%]">
            <div className="w-full rounded-2xl bg-black/40 py-3 px-4 backdrop-blur-lg border border-white/10 shadow-2xl transition-all group-hover:bg-black/60">
              <h3 className="text-center text-sm font-black uppercase tracking-wider text-white drop-shadow-md md:text-base">
                {lesson.title}
              </h3>
            </div>
          </div>
        </div>

        {/* КНОПКА РЕДАГУВАННЯ */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) onEdit(lesson);
            }}
            className="absolute top-5 right-5 z-20 cursor-pointer rounded-full bg-black/30 p-2.5 text-white shadow-lg backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white hover:text-gray-900"
          >
            <Pencil size={18} />
          </button>
        )}
      </div>

      {/* 🟢 МОДАЛКА */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 z-20 rounded-full bg-black/20 p-2 text-white backdrop-blur-xl transition-all hover:bg-black/50 hover:rotate-90"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col">
              <div className="relative h-72 w-full sm:h-96">
                {lesson.image ? (
                  <img src={lesson.image} alt={lesson.title} className="h-full w-full object-cover" />
                ) : (
                  <div className={`h-full w-full bg-linear-to-br ${style.gradient}`} />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                   <h2 className="text-3xl font-black uppercase tracking-tight text-white drop-shadow-2xl sm:text-4xl">
                    {lesson.title}
                  </h2>
                </div>
              </div>

              <div className="bg-white p-8 sm:p-12">
                <div className="mb-6 flex items-center gap-3 text-gray-400">
                  <div className={`h-8 w-1 rounded-full bg-linear-to-b ${style.gradient}`} />
                  <AlignLeft size={20} />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Детальніше</span>
                </div>
                <p className="text-xl leading-relaxed text-gray-700 font-medium">
                  {lesson.description || "Опис для цієї програми скоро з'явиться. Слідкуйте за оновленнями!"}
                </p>
                <div className="mt-10 flex justify-end">
                   <button 
                     onClick={() => setIsModalOpen(false)}
                     className={`rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-white shadow-lg transition-transform active:scale-95 bg-linear-to-r ${style.gradient} ${style.shadow}`}
                   >
                     Зрозуміло
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}