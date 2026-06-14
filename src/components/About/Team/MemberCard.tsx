import { User } from "lucide-react";
import type { TeamMember } from "../../../types/teamMember";
import { useTranslation } from "react-i18next";
import type { LangKey } from "../../../types/types";

const PhotoPlaceholder = () => (
  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 text-slate-400">
    <User size={76} strokeWidth={1} className="opacity-40" />
  </div>
);

export const MemberCard = ({
  member,
  setSelectedMember,
}: {
  member: TeamMember;
  setSelectedMember: (member: TeamMember) => void;
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as LangKey;

  const hasRealImage =
    typeof member.image === "string" &&
    member.image.trim() !== "" &&
    member.image !== "placeholder";

  const name = member.name[currentLang] || member.name.ua;
  const role = member.role[currentLang] || member.role.ua;

  return (
    <button
      type="button"
      onClick={() => setSelectedMember(member)}
      className="group flex w-full flex-col items-center text-center outline-none"
    >
      <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.14)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        {hasRealImage ? (
          <img
            src={member.image}
            alt={name}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <PhotoPlaceholder />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-slate-950/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="px-3">
        <h3 className="font-nunito mb-2 text-xl leading-tight text-slate-950">
          {name}
        </h3>

        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-yellow-400 transition-all duration-300 group-hover:w-16" />

        {role && (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            {role}
          </p>
        )}
      </div>
    </button>
  );
};