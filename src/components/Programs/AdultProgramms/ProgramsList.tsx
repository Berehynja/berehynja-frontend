import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  // Target, 
  Users, 
  Pencil, 
  Loader2, 
  MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { LangKey } from "../../../types/types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../AuthProvider/useAuth";
import type { ProgramAdults } from "../../../types/program";
import { AddEvent } from "../../Buttons/AddEvent";
import { AddProgramModal } from "../../Modals/AddAdultProgramsModal";
import {
  fetchProgramsAdults,
  updateProgramAdults,
  addProgramAdults,
  deleteProgramAdults,
} from "../../../services/programsAdultsService";

export const ProgramsList = () => {
  const { isAdmin } = useAuth();
  const { i18n } = useTranslation();
  const currentLang = i18n.language as LangKey;

  const [programs, setPrograms] = useState<ProgramAdults[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramAdults | null>(null);

  // 1. Завантаження даних
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProgramsAdults();
        setPrograms(data);
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Збереження/Оновлення
  const handleSave = async (formData: ProgramAdults) => {
    try {
      if (editingProgram) {
        await updateProgramAdults(editingProgram.id, formData);
        setPrograms(
          programs.map((p) =>
            p.id === editingProgram.id ? { ...formData, id: editingProgram.id } : p
          )
        );
      } else {
        const newProgram = await addProgramAdults(formData);
        setPrograms([...programs, newProgram]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Помилка збереження: " + error);
    }
  };

  // 3. Видалення
  const handleDelete = async (id: string) => {
    try {
      await deleteProgramAdults(id);
      setPrograms(programs.filter((p) => p.id !== id));
      setIsModalOpen(false);
    } catch (error) {
      alert("Помилка видалення: " + error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <>
      {isAdmin && (
        <AddEvent
          onClick={() => {
            setEditingProgram(null);
            setIsModalOpen(true);
          }}
        />
      )}

      <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <div
            key={program.id}
            className="group relative flex flex-col overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Кнопка редагування для адміна */}
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingProgram(program);
                  setIsModalOpen(true);
                }}
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition-all hover:bg-blue-600 hover:text-white active:scale-90"
              >
                <Pencil size={18} />
              </button>
            )}

            {/* Фото з матовою плашкою дат */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={program.image}
                alt="program"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute right-4 bottom-4 flex flex-col items-center justify-center rounded-2xl border border-white/30 bg-white/60 p-4 shadow-lg backdrop-blur-md">
                <span className="mb-0.5 text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                  Період
                </span>
                <span className="text-sm font-black text-gray-900 uppercase">
                  {program.dateRange}
                </span>
              </div>
            </div>

            {/* Контент */}
            <div className="flex flex-1 flex-col p-8">
              <h3 className="mb-4 text-2xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                {program.title[currentLang]}
              </h3>

              <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-500">
                {program.description[currentLang]}
              </p>

              {/* Деталі з іконками */}
              <div className="mb-8 space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 font-medium text-gray-400">
                    <Calendar size={18} className="text-blue-500" />
                    Тривалість:
                  </div>
                  <span className="font-bold text-gray-700">{program.duration[currentLang]}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 font-medium text-gray-400">
                    <Clock size={18} className="text-orange-500" />
                    Графік:
                  </div>
                  <span className="font-bold text-gray-700">{program.intensity[currentLang]}</span>
                </div>

                {/* <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 font-medium text-gray-400">
                    <Target size={18} className="text-purple-500" />
                    Для кого:
                  </div>
                  <span className="font-bold text-gray-700">{program.target[currentLang]}</span>
                </div> */}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 font-medium text-gray-400">
                    <Users size={18} className="text-green-500" />
                    Група:
                  </div>
                  <span className="font-bold text-gray-700">{program.capacity[currentLang]}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 font-medium text-gray-400">
                    <MapPin size={18} className="text-green-500" />
                    Локація:
                  </div>
                  <span className="font-bold text-gray-700">{program.location[currentLang]}</span>
                </div>
              </div>

              {/* Кнопка переходу */}
              <Link
                to={`/programs/adults/${program.id}`}
                className="mt-auto flex items-center justify-center gap-3 rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:shadow-lg active:scale-95"
              >
                Детальніше <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Модалка */}
      <AddProgramModal
        programToEdit={editingProgram}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
};
