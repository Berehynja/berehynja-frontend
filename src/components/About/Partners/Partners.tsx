import { useEffect, useState } from "react";
import { Building2, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { useAuth } from "../../AuthProvider/useAuth";
import { AddPartnerModal } from "../../Modals/AddPartnersModal";
import { PageLoader } from "../../ui/PageLoader";
import {
  addPartner,
  deletePartner,
  subscribeToPartners,
} from "../../../services/partnerService";
import type { Partner } from "../../../types/partners";
import type { LangKey } from "../../../types/types";

const PARTNERS_TEXT = {
  add: {
    ua: "Додати партнера",
    de: "Partner hinzufügen",
    en: "Add partner",
  },
  empty: {
    ua: "Партнери незабаром з’являться.",
    de: "Partner werden bald hinzugefügt.",
    en: "Partners will be added soon.",
  },
  delete: {
    ua: "Видалити партнера",
    de: "Partner löschen",
    en: "Delete partner",
  },
  confirmDelete: {
    ua: "Видалити цього партнера?",
    de: "Diesen Partner löschen?",
    en: "Delete this partner?",
  },
  openWebsite: {
    ua: "Відкрити сайт партнера",
    de: "Partner-Website öffnen",
    en: "Open partner website",
  },
  added: {
    ua: "Партнера додано!",
    de: "Partner wurde hinzugefügt!",
    en: "Partner added!",
  },
  deleted: {
    ua: "Партнера видалено!",
    de: "Partner wurde gelöscht!",
    en: "Partner deleted!",
  },
  addError: {
    ua: "Не вдалося додати партнера.",
    de: "Der Partner konnte nicht hinzugefügt werden.",
    en: "The partner could not be added.",
  },
  deleteError: {
    ua: "Не вдалося видалити партнера.",
    de: "Der Partner konnte nicht gelöscht werden.",
    en: "The partner could not be deleted.",
  },
};

export const Partners = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language).split(
    "-",
  )[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  useEffect(() => {
    const unsubscribe = subscribeToPartners((partnersData) => {
      setPartners(partnersData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddPartner = async (newPartner: Omit<Partner, "id">) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      await addPartner(newPartner);
      setIsModalOpen(false);
      toast.success(PARTNERS_TEXT.added[currentLang]);
    } catch (error) {
      console.error("Partner creation error:", error);
      toast.error(PARTNERS_TEXT.addError[currentLang]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      isProcessing ||
      !window.confirm(PARTNERS_TEXT.confirmDelete[currentLang])
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      await deletePartner(id);
      toast.success(PARTNERS_TEXT.deleted[currentLang]);
    } catch (error) {
      console.error("Partner deletion error:", error);
      toast.error(PARTNERS_TEXT.deleteError[currentLang]);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardClassName =
    "flex min-h-28 w-full items-center justify-center overflow-hidden bg-white p-4 outline-none transition-colors duration-300 group-hover:bg-blue-50/60 focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-blue-500/30 md:min-h-32 md:p-5 lg:min-h-36";

  return (
    <section className="w-full px-4 md:px-8">
      <PageLoader visible={isLoading || isProcessing} />

      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8 text-center md:mb-10">
          <h2 className="text-preset-2 font-nunito text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            {t("about.ourPartners")}
          </h2>

          <div
            aria-hidden="true"
            className="mx-auto mt-4 h-1 w-14 rounded-full bg-linear-to-r from-blue-500 to-yellow-400"
          />
        </header>

        {!isLoading && (partners.length > 0 || isAdmin) && (
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-4 xl:grid-cols-6">
            {isAdmin && (
              <li className="min-w-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="group/add flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-3 bg-blue-50/50 p-4 text-blue-700 outline-none transition-colors duration-300 hover:bg-blue-100/70 active:bg-blue-100 focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-blue-500/30 md:min-h-32 lg:min-h-36"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-white shadow-sm transition-transform duration-300 group-hover/add:scale-110">
                    <Plus size={22} aria-hidden="true" />
                  </span>
                  <span className="text-center text-xs font-bold md:text-sm">
                    {PARTNERS_TEXT.add[currentLang]}
                  </span>
                </button>
              </li>
            )}

            {partners.map((partner) => {
              const partnerName =
                partner.name[currentLang] || partner.name.ua || "Partner";

              const logoContent = partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partnerName}
                  loading="lazy"
                  decoding="async"
                  className="max-h-14 max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 md:max-h-16 lg:max-h-18"
                />
              ) : (
                <div className="flex min-w-0 flex-col items-center gap-2 text-slate-500">
                  <Building2 size={32} strokeWidth={1.5} aria-hidden="true" />
                  <span className="max-w-full truncate text-xs font-semibold">
                    {partnerName}
                  </span>
                </div>
              );

              return (
                <li
                  key={partner.id}
                  className="group relative min-w-0 bg-white"
                >
                  {partner.link ? (
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={partnerName}
                      aria-label={`${PARTNERS_TEXT.openWebsite[currentLang]}: ${partnerName}`}
                      className={cardClassName}
                    >
                      {logoContent}

                      <span className="absolute right-2.5 bottom-2.5 flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 opacity-70 transition-all group-hover:bg-white group-hover:text-blue-700 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100">
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
                      onClick={() => void handleDelete(partner.id!)}
                      aria-label={`${PARTNERS_TEXT.delete[currentLang]}: ${partnerName}`}
                      title={PARTNERS_TEXT.delete[currentLang]}
                      className="absolute top-2 right-2 z-20 flex size-11 cursor-pointer items-center justify-center rounded-xl border border-red-100 bg-white/95 text-red-600 shadow-md backdrop-blur transition-all duration-200 hover:border-red-600 hover:bg-red-600 hover:text-white active:scale-95 focus-visible:ring-3 focus-visible:ring-red-500/30 focus-visible:outline-none md:top-2.5 md:right-2.5"
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {!isLoading && partners.length === 0 && !isAdmin && (
          <div className="flex min-h-36 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm font-medium text-slate-600">
            {PARTNERS_TEXT.empty[currentLang]}
          </div>
        )}
      </div>

      {isAdmin && (
        <AddPartnerModal
          isOpen={isModalOpen}
          onClose={() => {
            if (!isProcessing) setIsModalOpen(false);
          }}
          onSave={handleAddPartner}
        />
      )}
    </section>
  );
};
