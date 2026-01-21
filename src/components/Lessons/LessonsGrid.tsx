import { useEffect, useState } from "react";
import { LessonCard } from "./LessonCard";
import { useAuth } from "../AuthProvider/useAuth";
import type { AgeGroup } from "../../types/ageGroup";
import { programsService } from "../../services/programsService";
import type { Program } from "../../types/program";
import { AddLessonModal } from "../Modals/AddLessonModal";

export function LessonsGrid(){
    const {isAdmin} = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);

// Стейт для даних, які потрібні модалці
    const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);

    // 1. Завантаження початкових даних (Групи + Програми)
   useEffect(() => {
    const loadData = async() =>{
        setIsLoading(true);
        try {
            const [fetchedGroups, fetchedPrograms] = await Promise.all([
                programsService.getAgeGroups(),
                programsService.getPrograms()
            ]);

            setAgeGroups(fetchedGroups);
            setPrograms(fetchedPrograms);
        } catch (error) {
            console.error("Помилка при завантаженні початкових даних:", error);
        } finally {
            setIsLoading(false);            
        }
    };
    loadData();
   }, []);


   const handleOpenCreate = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
   }

    const handleEditProgram = (program: Program) => {
        setEditingProgram(program);
        setIsModalOpen(true);
    }

   const handleSaveProgram = async(data: Omit<Program, "id">) => {
        try {
            const newProgram = await programsService.addProgram(data);

            setPrograms((prev) => [...prev, newProgram]);
            alert("Програма успішно додана!");
            
        } catch (error) {
            alert("Помилка при додаванні програми. Спробуйте ще раз.");
            console.error("Помилка при додаванні програми:", error);
        }
   }

    return(
        <div className="font-nunito mt-10 mb-25">
            <h2 className=" text-preset-2 my-8 text-gray-700 font-bold text-center">Програми</h2>

            {isLoading ? (
                <div className="text-center text-gray-400 py-10">Завантаження програм...</div>
            ) : (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
                    
                   

                    {/* КАРТКИ (Виводимо реальні дані з бази) */}
                    {programs.map((program) => (
                        <LessonCard 
                            key={program.id} 
                            lesson={program} 
                            onEdit={handleEditProgram}
                        />
                    ))}
                    
                    {programs.length === 0 && !isAdmin && (
                        <p className="col-span-full text-center text-gray-400">Поки що немає доступних програм.</p>
                    )}
             {/* КНОПКА ДОДАВАННЯ */}
                    {isAdmin && (
                        <button
                        onClick={handleOpenCreate}
                        className="
                        group flex flex-col items-center justify-center
                        h-full w-full
                        rounded-xl border-2 border-dashed border-gray-300 bg-gray-50
                        text-gray-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50
                        transition-all duration-300 cursor-pointer
                        "
                        >
                            <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">+</div>
                            <span className="text-lg font-bold">Додати програму</span>
                        </button>
                    )}

                </div>
            )}

            {/* 4. САМА МОДАЛКА (Без неї нічого не відкриється) */}
            <AddLessonModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProgram}
                ageGroups={ageGroups}
                programToEdit={editingProgram}
            />
        </div>

    )
}