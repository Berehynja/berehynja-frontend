import { useState, type Dispatch, type SetStateAction } from "react";
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

const LESSONS_GRID_TEXT = {
  title: {
    ua: "Всі програми",
    de: "Alle Programme",
    en: "All programs",
  },
  add: {
    ua: "Додати програму",
    de: "Programm hinzufügen",
    en: "Add program",
  },
  empty: {
    ua: "Поки що немає доступних програм.",
    de: "Derzeit sind keine Programme verfügbar.",
    en: "There are currently no programs available.",
  },
  confirmDelete: {
    ua: "Видалити цю програму?",
    de: "Dieses Programm löschen?",
    en: "Delete this program?",
  },
};

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

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language).split(
    "-",
  )[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

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

  const handleSaveProgram = async (data: Omit<Program, "id">, id?: string) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      if (id) {
        await programsService.updateProgram(id, data);

        setPrograms((currentPrograms) =>
          currentPrograms.map((program) =>
            program.id === id ? { ...data, id } : program,
          ),
        );
      } else {
        const newProgram = await programsService.addProgram(data);
        setPrograms((currentPrograms) => [...currentPrograms, newProgram]);
      }

      setIsModalOpen(false);
      setEditingProgram(null);
    } catch (error) {
      console.error("Program save error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (
      isProcessing ||
      !window.confirm(LESSONS_GRID_TEXT.confirmDelete[currentLang])
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      await programsService.deleteProgram(id);

      setPrograms((currentPrograms) =>
        currentPrograms.filter((program) => program.id !== id),
      );

      setIsModalOpen(false);
      setEditingProgram(null);
    } catch (error) {
      console.error("Program deletion error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section
      aria-labelledby="all-programs-title"
      className="font-nunito mb-25 w-full"
    >
      <PageLoader visible={isProcessing} />

      <h2
        id="all-programs-title"
        className="text-preset-2 mb-10 text-center font-semibold text-gray-800"
      >
        {LESSONS_GRID_TEXT.title[currentLang]}
      </h2>

      <div className="grid w-full auto-rows-fr grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {isAdmin && (
          <AddEvent
            onClick={handleOpenCreate}
            label={LESSONS_GRID_TEXT.add[currentLang]}
          />
        )}

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
            className="col-span-full py-10 text-center text-gray-600"
          >
            {LESSONS_GRID_TEXT.empty[currentLang]}
          </p>
        )}
      </div>

      {isAdmin && (
        <AddLessonModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveProgram}
          onDelete={handleDeleteProgram}
          ageGroups={ageGroups}
          programToEdit={editingProgram}
        />
      )}
    </section>
  );
}
