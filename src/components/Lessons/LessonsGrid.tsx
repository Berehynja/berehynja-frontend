import { useEffect, useState } from "react";
import { LessonCard } from "./LessonCard";
import { useAuth } from "../AuthProvider/useAuth";
import type { AgeGroup } from "../../types/ageGroup";
import { programsService } from "../../services/programsService";
import type { Program } from "../../types/program";
import { AddLessonModal } from "../Modals/AddLessonModal";
import { AddEvent } from "../Buttons/AddEvent";

export function LessonsGrid() {
  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Стейт для даних, які потрібні модалці
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // 1. Завантаження початкових даних (Групи + Програми)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedGroups, fetchedPrograms] = await Promise.all([
          programsService.getAgeGroups(),
          programsService.getPrograms(),
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
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleSaveProgram = async (data: Omit<Program, "id">, id?: string) => {
    try {
      if (id) {
        // Оновлення існуючої програми
        await programsService.updateProgram(id, data);

        setPrograms((prev) => prev.map((prog) => (prog.id === id ? { ...data, id } : prog)));
        alert("Програма успішно оновлена!");
      } else {
        const newProgram = await programsService.addProgram(data);

        setPrograms((prev) => [...prev, newProgram]);
        alert("Програма успішно додана!");
      }
    } catch (error) {
      alert("Помилка при додаванні програми. Спробуйте ще раз.");
      console.error("Помилка при додаванні програми:", error);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    try {
      await programsService.deleteProgram(id);

      setPrograms((prev) => prev.filter((prog) => prog.id !== id));
    } catch (error) {
      alert("Сталася помилка при видаленні програми. Спробуйте ще раз.");
      console.error("Помилка при видаленні програми:", error);
    }
  };

  return (
    <div className="font-nunito mt-10 mb-25">
      <h2 className="text-preset-2 my-8 text-center font-bold text-gray-700">Програми</h2>

      {isLoading ? (
        <div className="py-10 text-center text-gray-400">Завантаження програм...</div>
      ) : (
        <div className="grid auto-rows-fr grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-4">
          {/* КАРТКИ (Виводимо реальні дані з бази) */}
          {programs.map((program) => (
            <LessonCard key={program.id} lesson={program} onEdit={handleEditProgram} />
          ))}

          {programs.length === 0 && !isAdmin && (
            <p className="col-span-full text-center text-gray-400">
              Поки що немає доступних програм.
            </p>
          )}
          {/* КНОПКА ДОДАВАННЯ */}
          {isAdmin && <AddEvent onClick={handleOpenCreate} />}
        </div>
      )}

      {/* 4. САМА МОДАЛКА (Без неї нічого не відкриється) */}
      <AddLessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProgram}
        onDelete={handleDeleteProgram}
        ageGroups={ageGroups}
        programToEdit={editingProgram}
      />
    </div>
  );
}
