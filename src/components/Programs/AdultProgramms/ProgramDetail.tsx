import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Target,
  Users,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Info,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthProvider/useAuth";
import { getProgramAdultsById, updateProgramAdults } from "../../../services/programsAdultsService";
import { useTranslation } from "react-i18next";
import type { ProgramAdults } from "../../../types/program";
import type { LangKey } from "../../../types/types";
import { PageLoader } from "../../ui/PageLoader";
import toast from "react-hot-toast";
import { CourseRegistrationForm } from "./CourseRegistrationForm";

export const ProgramDetail = () => {
  const [program, setProgram] = useState<ProgramAdults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [editLang, setEditLang] = useState<LangKey>("ua");

  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const lang = ((i18n.resolvedLanguage || i18n.language).split("-")[0] as LangKey) || "ua";

  useEffect(() => {
    const getSingleEvent = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const programData = await getProgramAdultsById(id);
        setProgram(programData as ProgramAdults | null);
      } catch (error) {
        console.error("Помилка при завантаженні програми:", error);
        setProgram(null);
      } finally {
        setIsLoading(false);
      }
    };

    void getSingleEvent();
  }, [id]);

  useEffect(() => {
    if (!isRegistrationOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsRegistrationOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isRegistrationOpen]);

  const handleSave = async () => {
    if (!id || !program || isSaving) return;

    setIsSaving(true);

    try {
      await updateProgramAdults(id, program);
      setIsEditing(false);
      toast.success(t("programs.adults.detail.saved"));
    } catch (error) {
      console.error("Помилка при збереженні програми:", error);
      toast.error(t("programs.adults.detail.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <PageLoader visible />;

  if (!program) {
    return (
      <div className="font-nunito py-20 text-center text-2xl">
        {t("programs.adults.detail.notFound")}
      </div>
    );
  }

  const localizedTitle = program.title?.[lang]?.trim() || program.title?.ua?.trim() || "";
  const isActive = program.isActive !== false;

  return (
    <div className="font-nunito w-full text-left">
      <PageLoader visible={isSaving} />
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <Link
          to="/programs/adults"
          className="flex items-center gap-2 font-bold text-blue-500 transition-colors hover:text-blue-700"
        >
          <ArrowLeft size={20} /> {t("programs.adults.detail.back")}
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h2 className="text-preset-2 flex flex-nowrap justify-center pb-4 font-semibold">
            {localizedTitle}
          </h2>
          <div className="mb-4 h-1 w-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-12 px-4 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="relative h-120 w-full overflow-hidden rounded-[2.5rem] shadow-lg">
            <img
              src={program.image}
              className="h-full w-full object-cover"
              alt={localizedTitle}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute top-6 right-6 rounded-2xl border border-white/30 bg-white/60 p-5 shadow-lg backdrop-blur-md">
              <span className="mb-1 block text-xs font-bold tracking-widest text-blue-600 uppercase">
                {isActive
                  ? t("programs.adults.detail.registrationOpen")
                  : t("programs.adults.detail.registrationClosed")}
              </span>
              <span className="text-xl font-black text-gray-900">{program.dateRange}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-2xl font-bold">
                <Info className="text-blue-500" /> {t("programs.adults.detail.about")}
              </h3>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setEditLang(lang);
                  }}
                  className="flex items-center gap-1 text-sm font-bold text-blue-500 transition-all hover:opacity-70"
                >
                  {isEditing ? (
                    <>
                      <X size={16} /> {t("programs.adults.detail.cancel")}
                    </>
                  ) : (
                    <>
                      <Pencil size={16} /> {t("programs.adults.detail.edit")}
                    </>
                  )}
                </button>
              )}
            </div>

            {isEditing && (
              <div className="space-y-4">
                <div className="flex w-fit gap-2 rounded-xl bg-gray-100 p-1">
                  {(["ua", "de", "en"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setEditLang(l)}
                      aria-pressed={editLang === l}
                      className={`rounded-lg px-4 py-1.5 text-xs font-bold uppercase transition-all ${editLang === l ? "bg-white text-blue-600 shadow" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor={`program-title-${editLang}`}
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    {t("programs.adults.detail.courseTitle")}
                  </label>
                  <input
                    id={`program-title-${editLang}`}
                    type="text"
                    value={program.title?.[editLang] || ""}
                    onChange={(event) =>
                      setProgram((previousProgram) =>
                        previousProgram
                          ? {
                              ...previousProgram,
                              title: {
                                ...previousProgram.title,
                                [editLang]: event.target.value,
                              },
                            }
                          : previousProgram
                      )
                    }
                    placeholder={t("programs.adults.detail.courseTitlePlaceholder")}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-3.5 text-base font-semibold text-slate-950 transition-colors outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {isEditing ? (
              <textarea
                aria-label={t("programs.adults.detail.descriptionAria")}
                className="h-64 w-full rounded-3xl border-2 border-slate-100 bg-slate-50 p-6 font-medium outline-none focus:border-blue-500"
                value={program.description[editLang] || ""}
                onChange={(e) =>
                  setProgram((prev) =>
                    prev
                      ? {
                          ...prev,
                          description: { ...prev.description!, [editLang]: e.target.value },
                        }
                      : prev
                  )
                }
              />
            ) : (
              <p className="text-lg leading-8 font-medium whitespace-pre-line text-gray-600">
                {program.description[lang]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
            <div className="rounded-4xl border border-slate-100 bg-slate-50 p-8 text-left">
              <h4 className="mb-6 text-xl font-bold">{t("programs.adults.detail.features")}</h4>
              <ul className="space-y-4">
                {(isEditing
                  ? program.features?.[editLang]?.length
                    ? program.features[editLang]
                    : [""]
                  : program.features?.[lang] || []
                )
                  .filter((f: string) => (isEditing ? true : f.trim() !== ""))
                  .map((feature: string, index: number) =>
                    isEditing ? (
                      <div key={`${editLang}-${index}`} className="flex items-center gap-1">
                        <input
                          type="text"
                          className="mb-2 w-full rounded-xl border-2 border-slate-200 bg-white p-3 text-sm font-semibold shadow-sm outline-none focus:border-blue-500"
                          value={feature}
                          onChange={(e) => {
                            const newArray = [...(program.features?.[editLang] || [""])];
                            newArray[index] = e.target.value;

                            setProgram((prev) =>
                              prev
                                ? { ...prev, features: { ...prev.features!, [editLang]: newArray } }
                                : prev
                            );
                          }}
                        />
                        <button
                          type="button"
                          aria-label={t("programs.adults.detail.removeFeature")}
                          onClick={() =>
                            setProgram((prev) => {
                              const newArray = [...(prev?.features?.[editLang] || [])];
                              newArray.splice(index, 1);
                              return prev
                                ? {
                                    ...prev,
                                    features: {
                                      ...prev.features!,
                                      [editLang]: newArray,
                                    },
                                  }
                                : prev;
                            })
                          }
                        >
                          <X size={24} className="text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <li
                        key={index}
                        className="flex items-center gap-3 font-semibold text-gray-700"
                      >
                        <CheckCircle2 className="text-green-500" size={20} />
                        {feature}
                      </li>
                    )
                  )}
              </ul>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setProgram((prev) =>
                      prev
                        ? {
                            ...prev,
                            features: {
                              ...prev.features!,
                              [editLang]: [...(prev.features?.[editLang] || []), ""],
                            },
                          }
                        : prev
                    );
                  }}
                  className="pt-4 font-bold text-blue-500"
                >
                  + {t("programs.adults.detail.addFeature")}
                </button>
              )}
            </div>

            <div className="flex flex-col items-center justify-center rounded-4xl border border-blue-100 bg-blue-50 p-8 text-center">
              <Target size={48} className="mb-4 text-blue-500" />
              <h4 className="mb-2 text-xl font-bold">{t("programs.adults.detail.goal")}</h4>

              {isEditing ? (
                <textarea
                  aria-label={t("programs.adults.detail.goal")}
                  className="w-full rounded-2xl border-2 border-blue-100 bg-white p-3 font-semibold text-blue-800 outline-none focus:border-blue-500"
                  value={program.target?.[editLang] || ""}
                  onChange={(e) =>
                    setProgram((prev) =>
                      prev
                        ? { ...prev, target: { ...prev.target, [editLang]: e.target.value } }
                        : prev
                    )
                  }
                />
              ) : (
                <p className="font-semibold text-blue-800">{program.target[lang]}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-2xl bg-gray-900 px-10 py-4 font-bold text-white uppercase shadow-lg transition-all hover:bg-blue-600 active:scale-95"
            >
              <Save size={18} /> {t("programs.adults.detail.save")}
            </button>
          )}
        </div>

        <div className="text-left lg:col-span-1">
          <div className="sticky top-20 space-y-8 rounded-4xl border border-gray-100 bg-white p-8 shadow-2xl">
            <h4 className="border-b pb-2 text-xl font-bold">
              {t("programs.adults.detail.overview")}
            </h4>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-500">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="mb-1 text-xs leading-none font-bold text-gray-400 uppercase">
                    {t("programs.adults.detail.duration")}
                  </p>
                  <p className="leading-tight font-bold text-gray-800">{program.duration[lang]}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="mb-1 text-xs leading-none font-bold text-gray-400 uppercase">
                    {t("programs.adults.detail.schedule")}
                  </p>
                  <p className="leading-tight font-bold text-gray-800">{program.intensity[lang]}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-purple-50 p-3 text-purple-500">
                  <Users size={24} />
                </div>
                <div>
                  <p className="mb-1 text-xs leading-none font-bold text-gray-400 uppercase">
                    {t("programs.adults.detail.places")}
                  </p>
                  <p className="leading-tight font-bold text-gray-800">{program.capacity[lang]}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-green-50 p-3 text-green-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="mb-1 text-xs leading-none font-bold text-gray-400 uppercase">
                    {t("programs.adults.detail.location")}
                  </p>
                  <p className="leading-tight font-bold text-gray-800">{program.location[lang]}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isActive) setIsRegistrationOpen(true);
              }}
              disabled={!isActive}
              className={`w-full rounded-2xl py-5 text-lg font-bold tracking-widest uppercase shadow-lg transition-all ${
                isActive
                  ? "cursor-pointer bg-gray-900 text-white hover:bg-blue-600 active:scale-95"
                  : "cursor-not-allowed bg-slate-300 text-slate-600 shadow-none"
              }`}
            >
              {isActive
                ? t("programs.adults.detail.registerNow")
                : t("programs.adults.detail.unavailable")}
            </button>
            <p className="mt-2 text-center text-xs font-bold tracking-tighter text-gray-400 uppercase">
              {isActive
                ? t("programs.adults.detail.limitedPlaces")
                : t("programs.adults.detail.inactiveHint")}
            </p>
          </div>
        </div>
      </div>

      {isActive && isRegistrationOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("programs.adults.detail.registrationDialog")}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsRegistrationOpen(false);
            }
          }}
        >
          <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-4xl">
            <button
              type="button"
              onClick={() => setIsRegistrationOpen(false)}
              aria-label={t("programs.adults.detail.closeRegistration")}
              title={t("programs.adults.detail.close")}
              className="absolute top-4 right-4 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <CourseRegistrationForm
              courseId={program.id}
              courseTitle={localizedTitle}
              courseIsActive={isActive}
            />
          </div>
        </div>
      )}
    </div>
  );
};
