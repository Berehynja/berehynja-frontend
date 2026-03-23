import { User, Plus, Pencil } from "lucide-react"; // Додав Pencil
import { useState } from "react";
import { MemberModal } from "./MemberModal"; // Для перегляду
import { AddTeamMemberModal } from "../Modals/AddTeamMemberModal"; // Та, що ми робили (для редагування)
import { teamData as initialTeamData } from "../../data/teamData";
import type { TeamMember } from "../../types/teamMember";
import { MemberCard } from "./MemberCard";
import { useAuth } from "../AuthProvider/useAuth";

export const MembersList = () => {
  const { isAdmin } = useAuth();
  
  // Дані команди (можна підключити серверний запит пізніше)
  const [team, setTeam] = useState<TeamMember[]>(initialTeamData);
  
  // Стейт для перегляду деталей (MemberModal)
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);
  
  // Стейти для адмін-модалки (Створення/Редагування)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Обробники
  const handleSaveMember = (data: TeamMember) => {
    if (editingMember) {
      // Логіка оновлення
      setTeam(prev => prev.map(m => m.id === data.id ? data : m));
    } else {
      // Логіка додавання
      setTeam(prev => [...prev, data]);
    }
    setIsEditModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
    setIsEditModalOpen(false);
  };

  const openAddModal = () => {
    setEditingMember(null);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="mb-12 text-center">
        <h2 className="font-montserratBold mb-4 flex items-center justify-center gap-3 text-3xl">
          <User className="text-blue-500" size={32} /> Наша команда
        </h2>
        <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-blue-500"></div>
      </div>
      
      <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {team.map((member) => (
          <li key={member.id} className="relative group">
            <MemberCard 
              member={member} 
              setSelectedMember={setViewingMember}
            />
            
            {/* Кнопка редагування для адміна (Олівець) */}
            {isAdmin && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingMember(member);
                  setIsEditModalOpen(true);
                }}
                className="absolute top-4 right-4 z-10 p-3 
                           bg-white/90 backdrop-blur-sm rounded-full shadow-lg 
                           text-slate-600 border border-slate-100
                           opacity-0 group-hover:opacity-100 
                           hover:bg-blue-600 hover:text-white hover:scale-110
                           transition-all duration-300 ease-in-out cursor-pointer"
                title="Редагувати профіль"
              >
                <Pencil size={18} />
              </button>
            )}
          </li>
        ))}

        {/* Кнопка "Додати фахівця" */}
        {isAdmin && (
          <li 
            onClick={openAddModal}
            className="group flex min-h-[400px] cursor-pointer flex-col items-center justify-center 
                       rounded-[3rem] border-2 border-dashed border-slate-200 
                       bg-slate-50/50 text-slate-400 
                       transition-all duration-500 ease-out 
                       hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-500 hover:-translate-y-2"
          >
            <div className="mb-4 rounded-full bg-white p-5 shadow-sm 
                            group-hover:scale-110 group-hover:shadow-md 
                            transition-all duration-300">
              <Plus size={32} />
            </div>
            <span className="font-montserratBold text-xs uppercase tracking-[0.2em]">Додати фахівця</span>
          </li>
        )}
      </ul>

      {/* Модалки залишаються без змін */}
      <MemberModal memberTeam={viewingMember} onClose={() => setViewingMember(null)} />
      <AddTeamMemberModal 
        isOpen={isEditModalOpen}
        memberToEdit={editingMember}
        onClose={() => { setIsEditModalOpen(false); setEditingMember(null); }}
        onSave={handleSaveMember}
        onDelete={handleDeleteMember}
      />
    </>
  );
};
