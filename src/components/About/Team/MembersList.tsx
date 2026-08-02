import { useEffect, useState } from "react";
import { Pencil, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { MemberModal } from "./MemberModal";
import { MemberCard } from "./MemberCard";
import { AddTeamMemberModal } from "../../Modals/AddTeamMemberModal";
import { AddEvent } from "../../Buttons/AddEvent";
import { useAuth } from "../../AuthProvider/useAuth";
import { PageLoader } from "../../ui/PageLoader";
import {
  addTeamMember,
  deleteTeamMember,
  fetchTeamMembers,
  updateTeamMember,
} from "../../../services/teamService";
import type { TeamMember } from "../../../types/teamMember";
import type { LangKey } from "../../../types/types";

const MEMBERS_LIST_TEXT = {
  title: {
    ua: "Наша команда",
    de: "Unser Team",
    en: "Our team",
  },
  add: {
    ua: "Додати фахівця",
    de: "Teammitglied hinzufügen",
    en: "Add team member",
  },
  edit: {
    ua: "Редагувати профіль",
    de: "Profil bearbeiten",
    en: "Edit profile",
  },
  empty: {
    ua: "Інформацію про команду ще не додано.",
    de: "Es wurden noch keine Teaminformationen hinzugefügt.",
    en: "No team information has been added yet.",
  },
  confirmDelete: {
    ua: "Видалити цей профіль?",
    de: "Dieses Profil löschen?",
    en: "Delete this profile?",
  },
  added: {
    ua: "Фахівця додано!",
    de: "Teammitglied wurde hinzugefügt!",
    en: "Team member added!",
  },
  updated: {
    ua: "Профіль оновлено!",
    de: "Profil wurde aktualisiert!",
    en: "Profile updated!",
  },
  deleted: {
    ua: "Профіль видалено!",
    de: "Profil wurde gelöscht!",
    en: "Profile deleted!",
  },
  saveError: {
    ua: "Не вдалося зберегти профіль.",
    de: "Das Profil konnte nicht gespeichert werden.",
    en: "The profile could not be saved.",
  },
  deleteError: {
    ua: "Не вдалося видалити профіль.",
    de: "Das Profil konnte nicht gelöscht werden.",
    en: "The profile could not be deleted.",
  },
};

export const MembersList = () => {
  const { isAdmin } = useAuth();
  const { i18n } = useTranslation();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language).split(
    "-",
  )[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const data = await fetchTeamMembers();
        setTeam(data);
      } catch (error) {
        console.error("Team loading error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadTeam();
  }, []);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (isProcessing) return;

    setIsEditModalOpen(false);
    setEditingMember(null);
  };

  const handleSaveMember = async (
    data: TeamMember | Omit<TeamMember, "id">,
  ) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      if (editingMember?.id) {
        const memberId = editingMember.id;
        await updateTeamMember(memberId, data);

        setTeam((currentTeam) =>
          currentTeam.map((member) =>
            member.id === memberId
              ? { ...member, ...data, id: memberId }
              : member,
          ),
        );

        setViewingMember((currentMember) =>
          currentMember?.id === memberId
            ? { ...currentMember, ...data, id: memberId }
            : currentMember,
        );

        toast.success(MEMBERS_LIST_TEXT.updated[currentLang]);
      } else {
        const savedMember = await addTeamMember(data as Omit<TeamMember, "id">);
        setTeam((currentTeam) => [...currentTeam, savedMember]);
        toast.success(MEMBERS_LIST_TEXT.added[currentLang]);
      }

      setIsEditModalOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error("Team member save error:", error);
      toast.error(MEMBERS_LIST_TEXT.saveError[currentLang]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (
      isProcessing ||
      !window.confirm(MEMBERS_LIST_TEXT.confirmDelete[currentLang])
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      await deleteTeamMember(id);
      setTeam((currentTeam) =>
        currentTeam.filter((member) => member.id !== id),
      );
      setViewingMember((currentMember) =>
        currentMember?.id === id ? null : currentMember,
      );
      setIsEditModalOpen(false);
      setEditingMember(null);
      toast.success(MEMBERS_LIST_TEXT.deleted[currentLang]);
    } catch (error) {
      console.error("Team member deletion error:", error);
      toast.error(MEMBERS_LIST_TEXT.deleteError[currentLang]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section aria-labelledby="team-list-title" className="w-full">
      <PageLoader visible={isLoading || isProcessing} />

      <header className="mb-12 text-center">
        <h2
          id="team-list-title"
          className="font-nunito mb-4 flex items-center justify-center gap-3 text-3xl font-bold text-slate-950 md:text-4xl"
        >
          <User className="text-blue-600" size={32} aria-hidden="true" />
          {MEMBERS_LIST_TEXT.title[currentLang]}
        </h2>
        <div
          aria-hidden="true"
          className="mx-auto mb-6 h-1 w-20 rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
        />
      </header>

      {!isLoading && (
        <div className="grid w-full auto-rows-fr grid-cols-1 items-stretch gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 xl:grid-cols-4">
          {isAdmin && (
            <AddEvent
              onClick={handleOpenCreate}
              label={MEMBERS_LIST_TEXT.add[currentLang]}
            />
          )}

          {team.map((member) => {
            const memberName = member.name[currentLang] || member.name.ua;

            return (
              <div key={member.id} className="group relative h-full min-w-0">
                <MemberCard
                  member={member}
                  setSelectedMember={setViewingMember}
                />

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(member)}
                    aria-label={`${MEMBERS_LIST_TEXT.edit[currentLang]}: ${memberName}`}
                    title={MEMBERS_LIST_TEXT.edit[currentLang]}
                    className="absolute top-4 right-4 z-10 flex size-11 cursor-pointer items-center justify-center rounded-xl border border-white/60 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <Pencil size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
            );
          })}

          {team.length === 0 && !isAdmin && (
            <p
              role="status"
              className="col-span-full py-12 text-center text-slate-600"
            >
              {MEMBERS_LIST_TEXT.empty[currentLang]}
            </p>
          )}
        </div>
      )}

      <MemberModal
        memberTeam={viewingMember}
        onClose={() => setViewingMember(null)}
      />

      {isAdmin && (
        <AddTeamMemberModal
          isOpen={isEditModalOpen}
          memberToEdit={editingMember}
          onClose={handleCloseEditModal}
          onSave={handleSaveMember}
          onDelete={handleDeleteMember}
        />
      )}
    </section>
  );
};
