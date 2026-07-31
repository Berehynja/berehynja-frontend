import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, ExternalLink, Plus, Trash2 } from "lucide-react";

import { useAuth } from "../../AuthProvider/useAuth";
import { AddPartnerModal } from "../../Modals/AddPartnersModal";
import {
  addPartner,
  deletePartner,
  subscribeToPartners,
} from "../../../services/partnerService";

import type { Partner } from "../../../types/partners";
import type { LangKey } from "../../../types/types";

const labels = {
  addPartner: {
    ua: "Додати партнера",
    de: "Partner hinzufügen",
    en: "Add partner",
  },
  empty: {
    ua: "Партнери незабаром зʼявляться",
    de: "Partner werden bald hinzugefügt",
    en: "Partners will be added soon",
  },
  deletePartner: {
    ua: "Видалити партнера",
    de: "Partner löschen",
    en: "Delete partner",
  },
};

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
    const shouldDelete = window.confirm(
      t("common.confirmDelete") || "Видалити цього партнера?",
    );

    if (!shouldDelete) return;

    try {
      await deletePartner(id);
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  return (
    <section className="mb-20 w-full px-4 sm:px-6 md:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="text-preset-2 font-nunito text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            {t("about.ourPartners")}
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-linear-to-r from-blue-500 to-yellow-400" />
        </div>

        {partners.length > 0 || isAdmin ? (
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {partners.map((partner) => {
              const partnerName =
                partner.name[currentLang] || partner.name.ua || "Partner";

              const logoContent = partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partnerName}
                  className="max-h-14 max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 sm:max-h-16 lg:max-h-18"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Building2 size={32} strokeWidth={1.5} />
                  <span className="max-w-full truncate text-xs font-semibold">
                    {partnerName}
                  </span>
                </div>
              );

              const cardClassName =
                "flex min-h-28 w-full items-center justify-center overflow-hidden bg-white p-4 outline-none transition-colors duration-300 group-hover:bg-blue-50/60 focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-blue-500/30 sm:min-h-32 sm:p-5 lg:min-h-36";

              return (
                <li key={partner.id} className="group relative min-w-0 bg-white">
                  {partner.link ? (
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={partnerName}
                      aria-label={`${partnerName} — open website`}
                      className={cardClassName}
                    >
                      {logoContent}

                      <span className="absolute right-2.5 bottom-2.5 flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 opacity-70 transition-all group-hover:bg-white group-hover:text-blue-600 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                        <ExternalLink size={14} aria-hidden="true" />
                      </span>
                    </a>
                  ) : (
                    <div title={partnerName} className={cardClassName}>
                      {logoContent}
                    </div>
                  )}

                  {isAdmin && partner.id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(partner.id!)}
                      aria-label={`${labels.deletePartner[currentLang]}: ${partnerName}`}
                      title={labels.deletePartner[currentLang]}
                      className="absolute top-2 right-2 z-20 flex size-11 cursor-pointer items-center justify-center rounded-xl border border-red-100 bg-white/95 text-red-500 shadow-md backdrop-blur transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white active:scale-95 focus-visible:ring-3 focus-visible:ring-red-500/30 focus-visible:outline-none sm:top-2.5 sm:right-2.5"
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  )}
                </li>
              );
            })}

            {isAdmin && (
              <li className="min-w-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="group/add flex min-h-28 w-full flex-col items-center justify-center gap-3 bg-blue-50/50 p-4 text-blue-600 outline-none transition-colors duration-300 hover:bg-blue-100/70 active:bg-blue-100 focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-blue-500/30 sm:min-h-32 lg:min-h-36"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-white shadow-sm transition-transform duration-300 group-hover/add:scale-110">
                    <Plus size={22} aria-hidden="true" />
                  </span>
                  <span className="text-center text-xs font-bold sm:text-sm">
                    {labels.addPartner[currentLang]}
                  </span>
                </button>
              </li>
            )}
          </ul>
        ) : (
          <div className="flex min-h-36 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm font-medium text-slate-500">
            {labels.empty[currentLang]}
          </div>
        )}
      </div>

      <AddPartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPartner}
      />
    </section>
  );
};
