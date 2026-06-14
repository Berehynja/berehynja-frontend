import { X, Award, Briefcase, GraduationCap, User2 } from "lucide-react";
import { useEffect } from "react";
import type { TeamMember } from "../../../types/teamMember";
import { useTranslation } from "react-i18next";
import type { LangKey } from "../../../types/types";

interface MemberModalProps {
  memberTeam: TeamMember | null;
  onClose: () => void;
}

export const MemberModal = ({ memberTeam, onClose }: MemberModalProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as LangKey;

  useEffect(() => {
    if (!memberTeam) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [memberTeam, onClose]);

  if (!memberTeam) return null;

  const memberImage = memberTeam.image;

  const hasRealImage =
    typeof memberImage === "string" && memberImage.trim() !== "" && memberImage !== "placeholder";

  const name = memberTeam.name[currentLang] || memberTeam.name.ua;
  const role = memberTeam.role[currentLang] || memberTeam.role.ua;

  const description = memberTeam.description[currentLang] || memberTeam.description.ua;

  const education = memberTeam.education[currentLang] || memberTeam.education.ua;

  const skills =
    memberTeam.skills[currentLang]?.length > 0
      ? memberTeam.skills[currentLang]
      : memberTeam.skills.ua;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[92dvh] w-full max-w-[480px] flex-col overflow-y-auto rounded-[1.75rem] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.28)] [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:max-w-5xl md:grid-cols-[0.78fr_1.22fr] md:overflow-hidden md:rounded-[2.25rem] lg:grid-cols-[0.85fr_1.15fr] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm backdrop-blur transition hover:bg-red-50 hover:text-red-500 md:top-5 md:right-5 md:h-11 md:w-11"
        >
          <X size={21} />
        </button>

        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-slate-100 md:aspect-auto md:max-h-[92dvh] md:min-h-[520px]">
          {hasRealImage ? (
            <img
              src={memberImage}
              alt={name}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 text-slate-300">
              <User2 size={110} strokeWidth={0.7} />
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent md:hidden" />
        </div>

        <div className="min-h-0 px-5 py-6 [-ms-overflow-style:none] [scrollbar-width:none] md:max-h-[92dvh] md:overflow-y-auto md:px-9 md:py-10 lg:px-12 [&::-webkit-scrollbar]:hidden">
          <div className="mb-8">
            {role && (
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-9 bg-blue-500" />

                <p className="text-[11px] font-bold tracking-[0.2em] text-blue-600 uppercase">
                  {role}
                </p>
              </div>
            )}

            <h2 className="font-nunito text-2xl leading-tight text-slate-950 md:text-4xl">
              {name}
            </h2>

            <div className="mt-4 h-1 w-16 rounded-full bg-linear-to-r from-blue-500 to-yellow-400" />
          </div>

          <div className="space-y-7">
            {skills?.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Briefcase size={18} />
                  </div>

                  <h3 className="text-base font-bold text-slate-950">Професійні навички</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={`${skill}-${idx}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {description && (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600">
                    <Award size={18} />
                  </div>

                  <h3 className="text-base font-bold text-slate-950">Досвід та експертиза</h3>
                </div>

                <div className="relative">
                  <span className="absolute -top-4 -left-2 font-serif text-5xl leading-none text-slate-100 select-none">
                    “
                  </span>

                  <p className="relative text-[15px] leading-7 text-slate-600 md:text-base md:leading-8">
                    {description}
                  </p>
                </div>
              </section>
            )}

            {education && (
              <section className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 md:p-5">
                <div className="mb-3 flex items-center gap-3 text-slate-500">
                  <GraduationCap size={18} />

                  <h3 className="text-xs font-bold tracking-[0.18em] uppercase">Освіта</h3>
                </div>

                <p className="text-sm leading-7 text-slate-600">{education}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
