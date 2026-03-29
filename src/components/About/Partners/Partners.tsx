import { useState, useEffect } from "react";
import { Handshake, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../AuthProvider/useAuth";
import { AddPartnerModal } from "../../Modals/AddPartnersModal";
import defaultPartnerLogo from "../../../images/icons8-penguin-color/icons8-penguin-48.png";
import { AddEvent } from "../../Buttons/AddEvent";
import type { Partner } from "../../../types/partners";
import type { LangKey } from "../../../types/types";

// Імпорт сервісу
import { subscribeToPartners, addPartner, deletePartner } from "../../../services/partnerService";

export const Partners = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentLang = (i18n.language as LangKey);

  useEffect(() => {
    const unsubscribe = subscribeToPartners(setPartners);
    return () => unsubscribe();
  }, []);

  const handleAddPartner = async (newPartner: Omit<Partner, 'id'>) => {
    try {
      await addPartner(newPartner);
    } catch (error) {
      console.error("Error adding partner:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("common.confirmDelete") || "Видалити цього партнера?")) {
      try {
        await deletePartner(id);
      } catch (error) {
        console.error("Error deleting partner:", error);
      }
    }
  };

  return (
    <>
      <div className="mb-12 text-center relative">
        <h2 className="font-montserratBold mb-4 flex items-center justify-center gap-3 text-3xl uppercase">
          <Handshake className="text-blue-500" size={32} /> {t("about.ourPartners")}
        </h2>
        <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-linear-to-r from-blue-500 to-yellow-400"></div>
      </div>

      <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {partners.map((partnerItem) => {
          // Визначаємо, чи буде елемент посиланням
          const Tag = partnerItem.link ? 'a' : 'div';
          
          return (
            <li key={partnerItem.id} className="group relative flex flex-col items-center">
              {isAdmin && partnerItem.id && (
                <button 
                  onClick={() => handleDelete(partnerItem.id!)}
                  className="absolute -top-2 right-5 z-20 p-2 bg-white text-red-500 rounded-full shadow-md transition-opacity hover:bg-red-50 cursor-pointer border border-slate-100"
                >
                  <Trash2 size={14} />
                </button>
              )}

              <Tag 
                href={partnerItem.link} 
                target={partnerItem.link ? "_blank" : undefined}
                rel={partnerItem.link ? "noopener noreferrer" : undefined}
                className={`flex flex-col items-center ${partnerItem.link ? 'cursor-pointer' : ''}`}
              >
                <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-[2.5rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-blue-100 group-hover:shadow-xl overflow-hidden p-4">
                  <img
                    src={partnerItem.logo || defaultPartnerLogo}
                    alt={partnerItem.name[currentLang]}
                    className="max-h-full max-w-full object-contain opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                  />
                </div>

                <p className="px-2 text-center text-[12px] font-bold tracking-wider text-slate-400 uppercase transition-colors group-hover:text-blue-600 leading-tight">
                  {partnerItem.name[currentLang] || partnerItem.name["ua"]}
                </p>
              </Tag>
            </li>
          );
        })}

        {isAdmin && (
          <li className="flex items-center justify-center">
             <AddEvent onClick={() => setIsModalOpen(true)}/>
          </li>
        )}
      </ul>

      <AddPartnerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddPartner} 
      />
    </>
  );
};