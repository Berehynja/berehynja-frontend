import { User } from "lucide-react";
import type { TeamMember } from "../../../types/teamMember";
import { useTranslation } from "react-i18next";

const PhotoPlaceholder = () => (
  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 text-gray-400">
    <User size={80} strokeWidth={1} className="opacity-40" />
  </div>
);

export const MemberCard = ({ member, setSelectedMember }: { member: TeamMember; setSelectedMember: (member: TeamMember) => void;}) => {
  const { i18n } = useTranslation();

  return (
   
          <div
            
            onClick={() => setSelectedMember(member)}
            className="group relative flex cursor-pointer flex-col items-center text-center transition-all duration-300 hover:-translate-y-2"
          >
            {/* ДЕКОРАТИВНЫЙ КОНТЕЙНЕР ФОТО */}
            <div className="relative mb-6 h-80 w-full overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-xl transition-all duration-500 group-hover:border-blue-50 group-hover:shadow-2xl">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name[i18n.language as keyof typeof member.name]}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <PhotoPlaceholder />
              )}

              {/* Легкий градиент-наложение при наведении */}
              <div className="absolute inset-0 bg-linear-to-t from-blue-900/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            {/* ТЕКСТОВЫЙ БЛОК С ДЕКОРОМ */}
            <div className="px-4">
              <h3 className="font-montserratBold mb-1 text-xl text-gray-900">{member.name[i18n.language as keyof typeof member.name]}</h3>

              {/* Та самая динамическая желтая линия */}
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-yellow-400 transition-all duration-300 group-hover:w-20"></div>

              <p className="text-sm font-bold tracking-[0.15em] text-blue-600 uppercase opacity-80 transition-opacity group-hover:opacity-100">
                {member.role[i18n.language as keyof typeof member.role]}
              </p>
            </div>
          </div>
        
  );
}