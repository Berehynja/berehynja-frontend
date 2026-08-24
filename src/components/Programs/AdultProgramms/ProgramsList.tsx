import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../AuthProvider/useAuth";
import { AddEvent } from "../../Buttons/AddEvent";
import { AddProgramModal } from "../../Modals/AddAdultProgramsModal";
import { PageLoader } from "../../ui/PageLoader";
import {
  addProgramAdults,
  deleteProgramAdults,
  fetchProgramsAdults,
  updateProgramAdults,
} from "../../../services/programsAdultsService";
import type { ProgramAdults } from "../../../types/program";
import type { LangKey } from "../../../types/types";

const PROGRAMS_LIST_TEXT = {
  period: {
    ua: "Період",
    de: "Zeitraum",
    en: "Period",
  },
  duration: {
    ua: "Тривалість",
    de: "Dauer",
    en: "Duration",
  },
  schedule: {
    ua: "Графік",
    de: "Zeitplan",
    en: "Schedule",
  },
  group: {
    ua: "Група",
    de: "Gruppe",
    en: "Group",
  },
  location: {
    ua: "Локація",
    de: "Ort",
    en: "Location",
  },
  details: {
    ua: "Детальніше",
    de: "Mehr erfahren",
    en: "Learn more",
  },
  edit: {
    ua: "Редагувати програму",
    de: "Programm bearbeiten",
    en: "Edit program",
  },
  add: {
    ua: "Додати програму",
    de: "Programm hinzufügen",
    en: "Add program",
  },
  empty: {
    ua: "Наразі немає доступних програм.",
    de: "Derzeit sind keine Programme verfügbar.",
    en: "There are currently no programs available.",
  },
  confirmDelete: {
    ua: "Видалити цю програму?",
    de: "Dieses Programm löschen?",
    en: "Delete this program?",
  },
  added: {
    ua: "Програму додано!",
    de: "Programm wurde hinzugefügt!",
    en: "Program added!",
  },
  updated: {
    ua: "Програму оновлено!",
    de: "Programm wurde aktualisiert!",
    en: "Program updated!",
  },
  deleted: {
    ua: "Програму видалено!",
    de: "Programm wurde gelöscht!",
    en: "Program deleted!",
  },
  saveError: {
    ua: "Не вдалося зберегти програму.",
    de: "Das Programm konnte nicht gespeichert werden.",
    en: "The program could not be saved.",
  },
  deleteError: {
    ua: "Не вдалося видалити програму.",
    de: "Das Programm konnte nicht gelöscht werden.",
    en: "The program could not be deleted.",
  },
};

export const ProgramsList = () => {
  const { isAdmin } = useAuth();
  const { t, i18n } = useTranslation();
  const [programs, setPrograms] = useState<ProgramAdults[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramAdults | null>(
    null,
  );

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language).split(
    "-",
  )[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await fetchProgramsAdults();
        setPrograms(data);
      } catch (error) {
        console.error("Programs loading error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadPrograms();
  }, []);

  const handleOpenCreate = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (program: ProgramAdults) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isProcessing) return;

    setEditingProgram(null);
    setIsModalOpen(false);
  };

  const handleSave = async (formData: ProgramAdults) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      if (editingProgram) {
        await updateProgramAdults(editingProgram.id, formData);

        setPrograms((currentPrograms) =>
          currentPrograms.map((program) =>
            program.id === editingProgram.id
              ? { ...formData, id: editingProgram.id }
              : program,
          ),
        );

        toast.success(PROGRAMS_LIST_TEXT.updated[currentLang]);
      } else {
        const newProgram = await addProgramAdults(formData);
        setPrograms((currentPrograms) => [...currentPrograms, newProgram]);
        toast.success(PROGRAMS_LIST_TEXT.added[currentLang]);
      }

      setEditingProgram(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Program save error:", error);
      toast.error(PROGRAMS_LIST_TEXT.saveError[currentLang]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      isProcessing ||
      !window.confirm(PROGRAMS_LIST_TEXT.confirmDelete[currentLang])
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      await deleteProgramAdults(id);
      setPrograms((currentPrograms) =>
        currentPrograms.filter((program) => program.id !== id),
      );
      setEditingProgram(null);
      setIsModalOpen(false);
      toast.success(PROGRAMS_LIST_TEXT.deleted[currentLang]);
    } catch (error) {
      console.error("Program deletion error:", error);
      toast.error(PROGRAMS_LIST_TEXT.deleteError[currentLang]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <PageLoader visible={isLoading || isProcessing} />

      {!isLoading && (
        <ul className="grid w-full grid-cols-1 items-stretch justify-center gap-6 md:grid-cols-2 md:gap-7 xl:grid-cols-3 xl:gap-10">
          {isAdmin && (
            <li className="min-h-80">
              <AddEvent
                onClick={handleOpenCreate}
                label={PROGRAMS_LIST_TEXT.add[currentLang]}
              />
            </li>
          )}

          {programs.map((program, index) => {
            const isActive = program.isActive !== false;
            const title = program.title[currentLang] || program.title.ua;
            const description =
              program.description[currentLang] || program.description.ua;
            const duration =
              program.duration[currentLang] || program.duration.ua;
            const intensity =
              program.intensity[currentLang] || program.intensity.ua;
            const capacity =
              program.capacity[currentLang] || program.capacity.ua;
            const location =
              program.location[currentLang] || program.location.ua;

            return (
              <li
                key={program.id}
                className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-4xl border shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-all duration-500 ${
                  isActive
                    ? "border-gray-100 bg-white hover:-translate-y-2 hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)]"
                    : "border-slate-200 bg-slate-100 opacity-75 grayscale-[0.35]"
                }`}
              >
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(program)}
                    aria-label={`${PROGRAMS_LIST_TEXT.edit[currentLang]}: ${title}`}
                    title={PROGRAMS_LIST_TEXT.edit[currentLang]}
                    className="absolute top-4 right-4 z-20 flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/60 bg-white/90 text-gray-700 shadow-md backdrop-blur-md transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <Pencil size={18} aria-hidden="true" />
                  </button>
                )}

                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={program.image}
                    alt={title}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent"
                  />

                  {!isActive && (
                    <div className="absolute top-4 left-4 rounded-xl border border-white/60 bg-slate-900/80 px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase shadow-md backdrop-blur-sm">
                      {t("programs.adults.list.inactive")}
                    </div>
                  )}

                  {program.dateRange && (
                    <div className="absolute right-4 bottom-4 flex flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/85 px-4 py-3 text-center shadow-lg backdrop-blur-md">
                      <span className="mb-0.5 text-[11px] font-black tracking-widest text-blue-700 uppercase">
                        {PROGRAMS_LIST_TEXT.period[currentLang]}
                      </span>
                      <span className="text-sm font-black text-gray-900 uppercase">
                        {program.dateRange}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex grow flex-col p-5 md:p-6">
                  <h2 className="mb-3 text-2xl leading-tight font-bold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                    {title}
                  </h2>

                  {description && (
                    <p className="mb-5 line-clamp-3 min-h-18 text-sm leading-6 text-gray-600">
                      {description}
                    </p>
                  )}

                  <dl className="mb-6 grid gap-3 border-t border-gray-100 pt-5 text-sm">
                    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                      <dt className="flex items-center gap-2 font-semibold text-gray-500">
                        <Calendar
                          size={17}
                          className="shrink-0 text-blue-600"
                          aria-hidden="true"
                        />
                        {PROGRAMS_LIST_TEXT.duration[currentLang]}:
                      </dt>
                      <dd className="min-w-0 text-right font-bold wrap-break-word text-gray-800">
                        {duration}
                      </dd>
                    </div>

                    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                      <dt className="flex items-center gap-2 font-semibold text-gray-500">
                        <Clock
                          size={17}
                          className="shrink-0 text-orange-600"
                          aria-hidden="true"
                        />
                        {PROGRAMS_LIST_TEXT.schedule[currentLang]}:
                      </dt>
                      <dd className="min-w-0 text-right font-bold wrap-break-word text-gray-800">
                        {intensity}
                      </dd>
                    </div>

                    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                      <dt className="flex items-center gap-2 font-semibold text-gray-500">
                        <Users
                          size={17}
                          className="shrink-0 text-emerald-600"
                          aria-hidden="true"
                        />
                        {PROGRAMS_LIST_TEXT.group[currentLang]}:
                      </dt>
                      <dd className="min-w-0 text-right font-bold wrap-break-word text-gray-800">
                        {capacity}
                      </dd>
                    </div>

                    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                      <dt className="flex items-center gap-2 font-semibold text-gray-500">
                        <MapPin
                          size={17}
                          className="shrink-0 text-red-600"
                          aria-hidden="true"
                        />
                        {PROGRAMS_LIST_TEXT.location[currentLang]}:
                      </dt>
                      <dd className="min-w-0 text-right font-bold wrap-break-word text-gray-800">
                        {location}
                      </dd>
                    </div>
                  </dl>

                  {isActive ? (
                    <Link
                      to={`/programs/adults/${program.id}`}
                      aria-label={`${PROGRAMS_LIST_TEXT.details[currentLang]}: ${title}`}
                      className="group/link mt-auto flex items-center justify-center gap-3 rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-lg active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      <span className="tracking-wider uppercase">
                        {PROGRAMS_LIST_TEXT.details[currentLang]}
                      </span>
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover/link:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <div
                      aria-disabled="true"
                      className="mt-auto flex cursor-not-allowed items-center justify-center rounded-2xl bg-slate-300 px-6 py-4 text-center text-sm font-bold tracking-wider text-slate-600 uppercase"
                    >
                      {t("programs.adults.list.unavailable")}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!isLoading && programs.length === 0 && !isAdmin && (
        <p className="py-12 text-center text-gray-500">
          {PROGRAMS_LIST_TEXT.empty[currentLang]}
        </p>
      )}

      {isAdmin && (
        <AddProgramModal
          programToEdit={editingProgram}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};
