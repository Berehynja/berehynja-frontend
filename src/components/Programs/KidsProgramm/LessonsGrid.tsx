import {
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";

import { LessonCard } from "./LessonCard";
import { useAuth } from "../../AuthProvider/useAuth";
import { AddLessonModal } from "../../Modals/AddLessonModal";
import { AddEvent } from "../../Buttons/AddEvent";
import { PageLoader } from "../../ui/PageLoader";
import { programsService } from "../../../services/programsService";
import type { AgeGroup } from "../../../types/ageGroup";
import type { Program } from "../../../types/program";
import type { LangKey } from "../../../types/types";

interface LessonsGridProps {
  programs: Program[];
  ageGroups: AgeGroup[];
  setPrograms: Dispatch<SetStateAction<Program[]>>;
}

export function LessonsGrid({
  programs,
  ageGroups,
  setPrograms,
}: LessonsGridProps) {
  const { isAdmin } = useAuth();
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const currentLang = (
    i18n.resolvedLanguage || i18n.language
  ).split("-")[0] as LangKey;

  const texts = {
    title: {
      ua: "Всі програми",
      de: "Alle Programme",
      en: "All programs",
    },
    empty: {
      ua: "Поки що немає доступних програм.",
      de: "Derzeit sind keine Programme verfügbar.",
      en: "There are currently no programs available.",
    },
  };

  const handleCloseModal = () => {
    if (isProcessing) return;

    setIsModalOpen(false);
    setEditingProgram(null);
  };

  const handleOpenCreate = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleSaveProgram = async (
    data: Omit<Program, "id">,
    id?: string,
  ) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      if (id) {
        await programsService.updateProgram(id, data);

        setPrograms((previousPrograms) =>
          previousPrograms.map((program) =>
            program.id === id ? { ...data, id } : program,
          ),
        );
      } else {
        const newProgram = await programsService.addProgram(data);
        setPrograms((previousPrograms) => [...previousPrograms, newProgram]);
      }

      setIsModalOpen(false);
      setEditingProgram(null);
    } catch (error) {
      console.error("Помилка збереження програми:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      await programsService.deleteProgram(id);

      setPrograms((previousPrograms) =>
        previousPrograms.filter((program) => program.id !== id),
      );

      setIsModalOpen(false);
      setEditingProgram(null);
    } catch (error) {
      console.error("Помилка видалення програми:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section
      aria-labelledby="all-programs-title"
      className="font-nunito mb-25"
    >
      <PageLoader visible={isProcessing} />

      <h3
        id="all-programs-title"
        className="text-preset-2 mb-10 text-center font-semibold text-gray-800"
      >
        {texts.title[currentLang]}
      </h3>

      <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {programs.map((program) => (
          <LessonCard
            key={program.id}
            lesson={program}
            onEdit={handleEditProgram}
          />
        ))}

        {programs.length === 0 && !isAdmin && (
          <p
            role="status"
            className="col-span-full text-center text-gray-600"
          >
            {texts.empty[currentLang]}
          </p>
        )}

        {isAdmin && <AddEvent onClick={handleOpenCreate} />}
      </div>

      <AddLessonModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProgram}
        onDelete={handleDeleteProgram}
        ageGroups={ageGroups}
        programToEdit={editingProgram}
      />
    </section>
  );
}
