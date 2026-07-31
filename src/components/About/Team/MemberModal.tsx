import { Award, Briefcase, GraduationCap, User2, X } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import type { TeamMember } from "../../../types/teamMember";
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

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [memberTeam, onClose]);

  if (!memberTeam) return null;

  const memberImage = memberTeam.image;

  const hasRealImage =
    typeof memberImage === "string" &&
    memberImage.trim() !== "" &&
    memberImage !== "placeholder";

  const name = memberTeam.name[currentLang] || memberTeam.name.ua;
  const role = memberTeam.role[currentLang] || memberTeam.role.ua;
  const description =
    memberTeam.description[currentLang] || memberTeam.description.ua;
  const education =
    memberTeam.education[currentLang] || memberTeam.education.ua;

  const localizedSkills =
    memberTeam.skills[currentLang]?.length > 0
      ? memberTeam.skills[currentLang]
      : memberTeam.skills.ua;

  const skills = localizedSkills.filter((skill) => skill.trim() !== "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-modal-title"
    >
      <div
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex h-[94dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.28)] [-ms-overflow-style:none] [scrollbar-width:none] sm:h-[94dvh] md:grid md:h-auto md:max-h-[calc(100dvh-3rem)] md:max-w-2xl md:grid-cols-2 md:overflow-y-auto lg:max-h-[min(92dvh,760px)] lg:max-w-5xl lg:grid-cols-[minmax(380px,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)] lg:overflow-hidden lg:rounded-[2.25rem] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute top-3 right-3 z-20 flex size-10 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm backdrop-blur transition hover:bg-red-50 hover:text-red-500 focus-visible:ring-3 focus-visible:ring-blue-500/40 focus-visible:outline-none md:top-5 md:right-5 md:size-11"
        >
          <X size={21} />
        </button>

        <div className="relative h-[55%] w-full shrink-0 overflow-hidden bg-slate-100 md:col-start-1 md:row-start-1 md:h-full md:min-h-72 lg:row-span-2 lg:min-h-0">
          {hasRealImage ? (
            <img
              src={memberImage}
              alt={name}
              className="h-full w-full object-cover object-[center_35%] md:object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 text-slate-300">
              <User2
                className="h-24 w-24 sm:h-28 sm:w-28"
                strokeWidth={0.7}
              />
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent lg:hidden" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] md:contents [&::-webkit-scrollbar]:hidden">
        <div className="shrink-0 px-5 pt-6 pb-4 sm:px-7 sm:pt-8 sm:pb-5 md:col-start-2 md:row-start-1 md:flex md:flex-col md:justify-center md:px-8 md:py-8 lg:px-12 lg:pt-10 lg:pb-6">
          {role && (
            <div className="mb-3 flex items-start gap-3 pr-10 md:pr-8 lg:pr-12">
              <p className="text-[10px] leading-5 font-bold tracking-[0.18em] text-blue-600 uppercase sm:text-[11px] sm:tracking-[0.2em]">
                {role}
              </p>
            </div>
          )}

          <h2
            id="member-modal-title"
            className="font-nunito pr-10 text-2xl leading-tight text-slate-950 sm:text-3xl md:pr-6 md:text-3xl lg:pr-12 lg:text-4xl"
          >
            {name}
          </h2>

          <div className="mt-4 h-1 w-14 rounded-full bg-linear-to-r from-blue-500 to-yellow-400 md:w-16" />
        </div>

        <div className="min-h-0 px-5 pt-2 pb-6 sm:px-7 sm:pb-8 md:col-span-2 md:row-start-2 md:overflow-visible md:px-8 md:pt-4 lg:col-span-1 lg:col-start-2 lg:min-h-0 lg:overflow-y-auto lg:px-12 lg:pt-2 lg:pb-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="space-y-6 md:space-y-7">
            {skills.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-3 md:mb-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Briefcase size={18} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-950 sm:text-base">
                    Професійні навички
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={`${skill}-${idx}`}
                      className="max-w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs leading-5 font-medium break-words text-slate-700 sm:px-3.5 sm:text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {description && (
              <section>
                <div className="mb-3 flex items-center gap-3 md:mb-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600">
                    <Award size={18} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-950 sm:text-base">
                    Досвід та експертиза
                  </h3>
                </div>

                <div className="relative">
                  <span className="absolute -top-4 -left-2 font-serif text-5xl leading-none text-slate-100 select-none">
                    “
                  </span>

                  <p className="relative text-sm leading-7 whitespace-pre-line text-slate-600 sm:text-[15px] md:text-base md:leading-8">
                    {description}
                  </p>
                </div>
              </section>
            )}

            {education && (
              <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:rounded-3xl md:p-5">
                <div className="mb-3 flex items-center gap-3 text-slate-500">
                  <GraduationCap size={18} className="shrink-0" />

                  <h3 className="text-xs font-bold tracking-[0.18em] uppercase">
                    Освіта
                  </h3>
                </div>

                <p className="text-sm leading-7 whitespace-pre-line text-slate-600">
                  {education}
                </p>
              </section>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
