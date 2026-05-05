import { X, Award, Briefcase, GraduationCap, User2 } from "lucide-react";
import { useEffect } from "react";
import type { TeamMember } from "../../../types/teamMember";
import { useTranslation } from "react-i18next";

// Використовуємо той самий інтерфейс, що і в основному файлі

interface MemberModalProps {
  memberTeam: TeamMember | null;
  onClose: () => void;
}

export const MemberModal = ({ memberTeam, onClose }: MemberModalProps) => {
  const { i18n } = useTranslation();
  // Блокування скролу фону при відкритій модалці
  useEffect(() => {
    if (memberTeam) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [memberTeam]);

  if (!memberTeam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* Задній фон (Backdrop) з розмиттям */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Контент Модалки */}
      <div className="animate-in fade-in zoom-in relative w-full max-w-5xl overflow-hidden rounded-[3rem] bg-white shadow-2xl duration-300">
        {/* Кнопка закриття */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 rounded-full bg-white/80 p-2 text-gray-500 shadow-sm backdrop-blur-md transition-all hover:bg-red-50 hover:text-red-500"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* ЛІВА ЧАСТИНА: Велике фото або заглушка */}
          <div className="relative h-[350px] w-full overflow-hidden bg-gray-100 md:h-auto md:w-[45%]">
            {memberTeam.image ? (
              <img
                src={memberTeam.image}
                alt={memberTeam.name[i18n.language as keyof typeof memberTeam.name]}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 text-gray-300">
                <User2 size={120} strokeWidth={0.5} />
              </div>
            )}
            {/* Декоративний градієнт знизу для мобільних */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent md:hidden" />
          </div>

          {/* ПРАВА ЧАСТИНА: Інформація */}
          <div className="flex max-h-[50vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[55%] md:p-14">
            {/* Шапка модалки */}
            <div className="mb-10">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px w-8 bg-blue-500"></span>
                <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
                  {memberTeam.role[i18n.language as keyof typeof memberTeam.role]}
                </span>
              </div>
              <h2 className="font-nunito text-3xl leading-tight text-gray-900 md:text-4xl">
                {memberTeam.name[i18n.language as keyof typeof memberTeam.name]}
              </h2>
              {/* Та сама декоративна лінія, як на головній */}
              <div className="mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-blue-500 to-yellow-400" />
            </div>

            <div className="space-y-8">
              {/* Професійні навички */}
              <section>
                <div className="mb-4 flex items-center gap-3 text-gray-900">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <Briefcase size={20} />
                  </div>
                  <h3 className="text-lg font-bold">Професійні навички</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {memberTeam.skills[i18n.language as keyof typeof memberTeam.skills].map(
                    (skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </section>

              {/* Детальний опис (цитата/досвід) */}
              <section>
                <div className="mb-4 flex items-center gap-3 text-gray-900">
                  <div className="rounded-lg bg-yellow-50 p-2 text-yellow-600">
                    <Award size={20} />
                  </div>
                  <h3 className="text-lg font-bold">Досвід та експертиза</h3>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 -left-4 font-serif text-6xl leading-none text-gray-100 select-none">
                    “
                  </span>
                  <p className="relative pl-2 text-lg leading-relaxed text-gray-600 italic">
                    {memberTeam.description[i18n.language as keyof typeof memberTeam.description]}
                  </p>
                </div>
              </section>

              {/* Освіта */}
              <section className="border-t border-gray-100 pt-4">
                <div className="mb-2 flex items-center gap-3 text-gray-500">
                  <GraduationCap size={18} />
                  <h3 className="text-sm font-semibold tracking-wider uppercase">Освіта</h3>
                </div>
                <p className="ml-8 text-gray-500">
                  {memberTeam.education[i18n.language as keyof typeof memberTeam.education]}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
