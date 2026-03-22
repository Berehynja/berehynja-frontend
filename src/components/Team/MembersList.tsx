
import { User } from "lucide-react";
import { useState } from "react";
import { MemberModal } from "./MemberModal";
import { teamData } from "../../data/teamData";
import type { TeamMember } from "../../types/teamMember";
import { MemberCard } from "./MemberCard";



export const MembersList = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  return (
    <>
      <div className="mb-12 text-center">
        <h2 className="font-montserratBold mb-4 flex items-center justify-center gap-3 text-3xl">
          <User className="text-blue-500" size={32} /> Наша команда
        </h2>
        <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-blue-500"></div>
      </div>

      <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teamData.map((member, index) => (
          <MemberCard key={index} member={member} setSelectedMember={setSelectedMember}/>
        ))}
      </ul>
      {/* Модалка */}
      <MemberModal memberTeam={selectedMember} onClose={() => setSelectedMember(null)} />
    </>
  );
};
