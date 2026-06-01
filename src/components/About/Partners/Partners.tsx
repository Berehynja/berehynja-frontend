import { useState, useEffect } from "react";
import {  Trash2 } from "lucide-react";
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

  const currentLang = i18n.language as LangKey;

  useEffect(() => {
    const unsubscribe = subscribeToPartners(setPartners);
    return () => unsubscribe();
  }, []);

  const handleAddPartner = async (newPartner: Omit<Partner, "id">) => {
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
    <section className="w-full mb-20">
      {/* Заголовок секції */}
      <div className="mb-12 flex items-center justify-between text-center">
        <h2 className="text-3xl md:text-4xl w-full text-preset-2 font-nunito text-gray-900 font-semibold tracking-tight">
          {t("about.ourPartners")}
        </h2>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center">
        {partners.map((partnerItem) => {
          const Tag = partnerItem.link ? "a" : "div";

          return (
            <li 
              key={partnerItem.id} 
              className="group relative flex h-24 w-full items-center justify-center"
            >
              {isAdmin && partnerItem.id && (
                <button
                  onClick={() => handleDelete(partnerItem.id!)}
                  className="absolute -top-4 -right-4 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer rounded-full bg-white p-1.5 text-red-500 shadow-md hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <Tag
                href={partnerItem.link}
                target={partnerItem.link ? "_blank" : undefined}
                rel={partnerItem.link ? "noopener noreferrer" : undefined}
                title={partnerItem.name[currentLang] || partnerItem.name["ua"]}
                className={`flex h-full w-full items-center justify-center p-2 outline-none ${partnerItem.link ? "cursor-pointer" : ""}`}
              >
                <img
                  src={partnerItem.logo || defaultPartnerLogo}
                  alt={partnerItem.name[currentLang]}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </Tag>
            </li>
          );
        })}

        {isAdmin && (
          <li className="flex h-24 w-full items-center justify-center">
            <AddEvent onClick={() => setIsModalOpen(true)} />
          </li>
        )}
      </ul>

      <AddPartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPartner}
      />
    </section>
  );
};