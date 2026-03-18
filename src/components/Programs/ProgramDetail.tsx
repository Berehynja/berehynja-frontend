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
import { useAuth } from "../AuthProvider/useAuth";
import { getProgramAdultsById, updateProgramAdults } from "../../services/programsAdultsService";
import { useTranslation } from "react-i18next";
import type { ProgramAdults } from "../../types/program";
import type { LangKey } from "../../types/types";

export const ProgramDetail = () => {
  const [program, setProgram] = useState<ProgramAdults | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editLang, setEditLang] = useState<LangKey>("ua");

  const { id } = useParams();
  const { i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const lang = (i18n.language as LangKey) || "ua";

  useEffect(() => {
    const getSingleEvent = async () => {
      if (!id) return;
      const programData = await getProgramAdultsById(id);
      setProgram(programData as ProgramAdults);
    };
    getSingleEvent();
  }, [id]);

  const handleSave = async () => {
    if (!id || !program) return;
    await updateProgramAdults(id, program);
    setIsEditing(false);
  };

  if (!program) {
    return <div className="font-nunito py-20 text-center text-2xl">Програму не знайдено</div>;
  }

  return (
    <div className="font-nunito w-full pb-20 text-left">
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <Link
          to="/programs/adults"
          className="flex items-center gap-2 font-bold text-blue-500 transition-colors hover:text-blue-700"
        >
          <ArrowLeft size={20} /> Повернутися до списку
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h2 className="text-preset-2 flex flex-nowrap justify-center pb-4 font-bold">
            {program.title[lang]}
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
              alt={program.title[lang]}
            />
            <div className="absolute top-6 right-6 rounded-2xl border border-white/30 bg-white/60 p-5 shadow-lg backdrop-blur-md">
              <span className="mb-1 block text-xs font-bold tracking-widest text-blue-600 uppercase">
                Реєстрація відкрита
              </span>
              <span className="text-xl font-black text-gray-900">{program.dateRange}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-2xl font-bold">
                <Info className="text-blue-500" /> Про програму
              </h3>
              {isAdmin && (
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  setEditLang(lang);
                }}
                className="flex items-center gap-1 text-sm font-bold text-blue-500 transition-all hover:opacity-70"
              >
                {isEditing ? (
                  <>
                    <X size={16} /> Скасувати
                  </>
                ) : (
                  <>
                    <Pencil size={16} /> Редагувати
                  </>
                )}
              </button>
              )}

            </div>

            {isEditing && (
              <div className="mb-2 flex w-fit gap-2 rounded-xl bg-gray-100 p-1">
                {(["ua", "de", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setEditLang(l)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold uppercase transition-all ${editLang === l ? "bg-white text-blue-600 shadow" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}

            {isEditing ? (
              <textarea
                className="h-64 w-full rounded-3xl border-2 border-slate-100 bg-slate-50 p-6 font-medium outline-none focus:border-blue-500"
                value={program.description[editLang] || ""}
                onChange={(e) =>
                  setProgram((prev) => prev 
                  ? {...prev, description: {...prev.description!, [editLang]: e.target.value }} 
                  : prev )}
              />
            ) : (
              <p className="text-lg leading-8 font-medium whitespace-pre-line text-gray-600">
                {program.description[lang]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
            <div className="rounded-4xl border border-slate-100 bg-slate-50 p-8 text-left">
              <h4 className="mb-6 text-xl font-bold">Що ви дізнаєтесь:</h4>
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

                          setProgram((prev) => prev
                          ? {...prev, features: {...prev.features!, [editLang]: newArray } } 
                          : prev );
                        }}
                      /><X 
                      size={24} 
                      className="text-red-500"
                      onClick={()=> setProgram((prev) => {const newArray = [...(prev?.features?.[editLang] || [])];
                      newArray.splice(index, 1);
                      return prev ? {...prev, features: {...prev.features!, [editLang]: newArray }} : prev;})}
                      /></div>
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
                        ? {...prev, features: {...prev.features!, [editLang]: [...(prev.features?.[editLang] || []), ""]}} 
                        : prev );
                  }}
                  className="pt-4 font-bold text-blue-500"
                >
                  + Додати пункт
                </button>
              )}
            </div>

            <div className="flex flex-col items-center justify-center rounded-4xl border border-blue-100 bg-blue-50 p-8 text-center">
              <Target size={48} className="mb-4 text-blue-500" />
              <h4 className="mb-2 text-xl font-bold">Мета курсу</h4>

              {isEditing ? (
                <textarea
                  className="w-full rounded-2xl border-2 border-blue-100 bg-white p-3 font-semibold text-blue-800 outline-none focus:border-blue-500"
                  value={program.target?.[editLang] || ""}
                  onChange={(e) =>
                    setProgram((prev) => prev ? {...prev, target: {...prev.target, [editLang]: e.target.value }} : prev)}
                />
              ) : (
                <p className="font-semibold text-blue-800">{program.target[lang]}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-2xl bg-gray-900 px-10 py-4 font-bold text-white uppercase shadow-lg transition-all hover:bg-blue-600 active:scale-95"
            >
              <Save size={18} /> Зберегти зміни
            </button>
          )}
        </div>

        <div className="text-left lg:col-span-1">
          <div className="sticky top-20 space-y-8 rounded-4xl border border-gray-100 bg-white p-8 shadow-2xl">
            <h4 className="border-b pb-2 text-xl font-bold">Огляд програми</h4>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-500">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="mb-1 text-xs leading-none font-bold text-gray-400 uppercase">
                    Тривалість
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
                    Графік
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
                    Місця
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
                    Локація
                  </p>
                  <p className="leading-tight font-bold text-gray-800">{program.location[lang]}</p>
                </div>
              </div>
            </div>

            <button className="w-full rounded-2xl bg-gray-900 py-5 text-lg font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:bg-blue-600 active:scale-95">
              Записатися зараз
            </button>
            <p className="mt-2 text-center text-xs font-bold tracking-tighter text-gray-400 uppercase">
              Кількість місць обмежена
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
