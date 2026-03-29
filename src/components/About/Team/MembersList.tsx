import { User, Plus, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { MemberModal } from "./MemberModal";
import { AddTeamMemberModal } from "../../Modals/AddTeamMemberModal";
// Імпортуємо твої сервіси Firebase
import { 
  fetchTeamMembers, 
  addTeamMember, 
  updateTeamMember, 
  deleteTeamMember 
} from "../../../services/teamService"; 
import type { TeamMember } from "../../../types/teamMember";
import { MemberCard } from "./MemberCard";
import { useAuth } from "../../AuthProvider/useAuth";

export const MembersList = () => {
  const { isAdmin } = useAuth();
  
  // Початковий стейт тепер порожній масив, чекаємо дані з бази
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // 1. Завантаження даних з Firebase при монтуванні
  useEffect(() => {
    const loadTeam = async () => {
      try {
        const data = await fetchTeamMembers();
        setTeam(data);
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeam();
  }, []);

  // 2. Обробник збереження (Створення або Редагування)
  const handleSaveMember = async (data: TeamMember | Omit<TeamMember, 'id'>) => {
    try {
      if (editingMember) {
        // Логіка оновлення в Firebase
        const memberId = editingMember.id;
        await updateTeamMember(memberId!, data);
        
        // Оновлюємо локальний стейт
        setTeam(prev => prev.map(m => m.id === memberId ? { ...m, ...data } : m));
      } else {
        // Логіка додавання в Firebase
        // Передаємо дані без ID, Firebase згенерує його сам
        const savedMember = await addTeamMember(data as Omit<TeamMember, 'id'>);
        
        // Додаємо в стейт об'єкт з реальним ID з бази
        setTeam(prev => [...prev, savedMember]);
      }
    } catch (error) {
      console.error("Не вдалося зберегти:", error);
      alert("Помилка при збереженні в базу даних");
    } finally {
      setIsEditModalOpen(false);
      setEditingMember(null);
    }
  };

  // 3. Обробник видалення
  const handleDeleteMember = async (id: string) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цей профіль?")) return;
    
    try {
      await deleteTeamMember(id);
      setTeam(prev => prev.filter(m => m.id !== id));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Помилка видалення:", error);
    }
  };

  const openAddModal = () => {
    setEditingMember(null);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return <div className="py-20 text-center text-slate-400">Завантаження команди...</div>;
  }

  return (
    <>
      <div className="mb-12 text-center">
        <h2 className="font-montserratBold mb-4 flex items-center justify-center gap-3 text-3xl">
          <User className="text-blue-500" size={32} /> Наша команда
        </h2>
        <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-blue-500"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {team.map((member) => (
    /* Замінюємо <li> на <div>, щоб не було вкладеності списків */
    <div key={member.id} className="relative group">
      <MemberCard 
        member={member} 
        setSelectedMember={setViewingMember}
      />
      
      {/* Кнопка редагування (Олівець) тепер безпечно лежить поруч у div */}
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
                     hover:bg-blue-600 hover:text-white 
                     transition-all duration-300 ease-in-out cursor-pointer"
          title="Редагувати профіль"
        >
          <Pencil size={18} />
        </button>
      )}
    </div>
  ))}

  {/* Кнопка "Додати" залишається як <li>, бо вона не містить MemberCard */}
  {isAdmin && (
    <div
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
    </div>
  )}
</div>

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
