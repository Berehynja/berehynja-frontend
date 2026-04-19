import { useState } from "react";
import { LessonCard } from "./LessonCard";
import { useAuth } from "../../AuthProvider/useAuth";
import type { AgeGroup } from "../../../types/ageGroup";
import type { Program } from "../../../types/program";
import { programsService } from "../../../services/programsService";
import { AddLessonModal } from "../../Modals/AddLessonModal";
import { AddEvent } from "../../Buttons/AddEvent";

interface LessonsGridProps {
  programs: Program[];
  ageGroups: AgeGroup[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
}

export function LessonsGrid({ programs, ageGroups, setPrograms }: LessonsGridProps) {
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

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
        // alert("Програма успішно оновлена!");
      } else {
        const newProgram = await programsService.addProgram(data);

        setPrograms((prev) => [...prev, newProgram]);
        // alert("Програма успішно додана!");
      }
    } catch (error) {
      // alert("Помилка при додаванні програми. Спробуйте ще раз.");
      console.error("Помилка при додаванні програми:", error);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    try {
      await programsService.deleteProgram(id);

      setPrograms((prev) => prev.filter((prog) => prog.id !== id));
    } catch (error) {
      // alert("Сталася помилка при видаленні програми. Спробуйте ще раз.");
      console.error("Помилка при видаленні програми:", error);
    }
  };

  return (
    <div className="font-nunito mb-25">
      <h3 className="text-preset-2 mb-10 text-center font-semibold text-gray-700">
        Всі програми
      </h3>
      <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
