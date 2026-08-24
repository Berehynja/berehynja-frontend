import { Briefcase, Heart, HouseHeart, School, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { EditTextModal } from "../../Modals/EditTextModal";
import { useFirebaseContent } from "../../../hooks/useFirebaseContent";
import { useAuth } from "../../AuthProvider/useAuth";
import EditButton from "../../Buttons/EditButton";
import type { LangKey } from "../../../types/types";

const EDITOR_LANGUAGES: LangKey[] = ["ua", "de", "en"];

const TEXT_LIMITS = {
  sectionTitle: 60,
  cardTitle: 28,
  cardSubtitle: 28,
  cardLead: 180,
  primaryCardText: 520,
  regularCardText: 320,
} as const;

const cardsConfig = [
  {
    id: "mission",
    icon: <HouseHeart />,
    className: "bg-Blue-2 bg-decor md:col-span-2 xl:col-span-2",
  },
  {
    id: "children",
    icon: <School />,
    className: "bg-Blue-2 md:row-start-2 xl:col-start-3 xl:row-start-1",
  },
  {
    id: "community",
    icon: <Users />,
    className:
      "bg-Blue-2 text-grey-500 md:row-start-2 xl:col-start-4 xl:row-start-1",
  },
  {
    id: "adults",
    icon: <Briefcase />,
    className:
      "bg-Orange-2 md:col-span-2 xl:col-start-1 xl:row-start-2",
  },
  {
    id: "summary",
    icon: <Heart />,
    className:
      "bg-Orange-2 md:col-span-2 xl:col-start-3 xl:row-start-2",
  },
] as const;

type LocalizedText = Record<LangKey, string>;

const getNestedValue = (source: unknown, path: string): unknown => {
  return path.split(".").reduce<unknown>((currentValue, key) => {
    if (
      !currentValue ||
      typeof currentValue !== "object" ||
      !(key in currentValue)
    ) {
      return undefined;
    }

    return (currentValue as Record<string, unknown>)[key];
  }, source);
};

export default function OurMission() {
  const [isTitleOpen, setIsTitleOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [translationsVersion, setTranslationsVersion] = useState(0);

  const { getText, isLoading, data } = useFirebaseContent("home");
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    let isMounted = true;

    void i18n.loadLanguages(EDITOR_LANGUAGES).then(() => {
      if (isMounted) {
        setTranslationsVersion((version) => version + 1);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [i18n]);

  const editorData = useMemo(() => {
    // Rebuild editor values after the additional translation files are loaded.
    void translationsVersion;

    const getEditorText = (path: string): LocalizedText => {
      const storedValue = getNestedValue(data, path);
      const storedTranslations =
        storedValue && typeof storedValue === "object"
          ? (storedValue as Partial<Record<LangKey, unknown>>)
          : {};

      return EDITOR_LANGUAGES.reduce<LocalizedText>(
        (result, language) => {
          const storedLanguageValue = storedTranslations[language];

          if (
            typeof storedLanguageValue === "string" &&
            storedLanguageValue.trim()
          ) {
            result[language] = storedLanguageValue;
            return result;
          }

          // Підтримка старого формату, де рядок вважався українським.
          if (language === "ua" && typeof storedValue === "string") {
            result.ua = storedValue;
            return result;
          }

          const translatedValue = i18n.getFixedT(language)(path, {
            defaultValue: "",
          });

          result[language] =
            typeof translatedValue === "string" ? translatedValue : "";
          return result;
        },
        { ua: "", de: "", en: "" },
      );
    };

    const cardData = activeCard
      ? {
          title: getEditorText(`ourMission.cards.${activeCard}.title`),
          subtitle: getEditorText(`ourMission.cards.${activeCard}.subtitle`),
          lead: getEditorText(`ourMission.cards.${activeCard}.lead`),
          text: getEditorText(`ourMission.cards.${activeCard}.text`),
        }
      : {};

    return {
      card: cardData,
      title: {
        title: getEditorText("ourMission.title"),
      },
    };
  }, [activeCard, data, i18n, translationsVersion]);

  const mainTitle = getText("ourMission.title", t("ourMission.title"));

  return (
    <section className="relative w-full overflow-visible">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="text-center"
      >
        <div
          className={`relative mx-auto w-fit max-w-full ${isAdmin ? "pr-12" : "pr-0"}`}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            {mainTitle}
          </h2>

          {isAdmin && (
            <EditButton
              onClick={() => setIsTitleOpen(true)}
              className="top-1/2 right-0 -translate-y-1/2 border border-gray-200 bg-white text-gray-700 shadow hover:scale-105 hover:bg-blue-600 hover:text-white"
              size={36}
            />
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto mt-10 grid w-full gap-5 px-3 md:grid-cols-2 md:gap-6 md:px-4 xl:grid-cols-4"
      >
        {cardsConfig.map((card) => {
          const titlePath = `ourMission.cards.${card.id}.title`;
          const subtitlePath = `ourMission.cards.${card.id}.subtitle`;
          const leadPath = `ourMission.cards.${card.id}.lead`;
          const textPath = `ourMission.cards.${card.id}.text`;

          return (
            <aside
              key={card.id}
              className={`${card.className} group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200/80 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-500 ease-out hover:z-10 hover:-translate-y-2 hover:shadow-[0_26px_64px_rgba(15,23,42,0.22)] md:p-8`}
            >
              {isAdmin && (
                <EditButton
                  onClick={() => setActiveCard(card.id)}
                  className="top-4 right-4 h-12 w-12 border border-gray-200 bg-white text-gray-700 shadow-xl hover:scale-110 hover:bg-blue-600 hover:text-white"
                  size={36}
                />
              )}

              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-800 shadow-sm">
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="min-w-0 text-xl leading-tight font-semibold wrap-break-word text-slate-950 md:text-2xl">
                    {isLoading ? "..." : getText(titlePath, t(titlePath))}
                  </h3>
                  <p className="mt-1 min-w-0 text-sm leading-6 font-semibold wrap-break-word text-slate-500 md:text-base">
                    {isLoading
                      ? "..."
                      : getText(subtitlePath, t(subtitlePath))}
                  </p>
                </div>
              </div>

              <p className="min-w-0 text-base leading-7 font-semibold wrap-break-word text-slate-800 md:text-lg md:leading-8">
                {isLoading ? "..." : getText(leadPath, t(leadPath))}
              </p>
              <p className="min-w-0 text-base leading-7 font-medium wrap-break-word text-slate-600">
                {isLoading ? "..." : getText(textPath, t(textPath))}
              </p>
            </aside>
          );
        })}
      </motion.div>

      <EditTextModal
        isOpen={Boolean(activeCard)}
        onClose={() => setActiveCard(null)}
        documentName="home"
        sectionName={`ourMission.cards.${activeCard}`}
        modalTitle="Редагування картки"
        initialData={editorData.card}
        fields={[
          {
            key: "title",
            label: "Заголовок",
            type: "input",
            maxLength: TEXT_LIMITS.cardTitle,
          },
          {
            key: "subtitle",
            label: "Підзаголовок",
            type: "input",
            maxLength: TEXT_LIMITS.cardSubtitle,
          },
          {
            key: "lead",
            label: "Лідабзац",
            type: "textarea",
            maxLength: TEXT_LIMITS.cardLead,
          },
          {
            key: "text",
            label: "Основний текст",
            type: "textarea",
            maxLength:
              activeCard === "mission"
                ? TEXT_LIMITS.primaryCardText
                : TEXT_LIMITS.regularCardText,
          },
        ]}
      />

      <EditTextModal
        isOpen={isTitleOpen}
        onClose={() => setIsTitleOpen(false)}
        documentName="home"
        sectionName="ourMission"
        modalTitle="Редагування заголовку"
        initialData={editorData.title}
        fields={[
          {
            key: "title",
            label: "Заголовок",
            type: "input",
            maxLength: TEXT_LIMITS.sectionTitle,
          },
        ]}
      />
    </section>
  );
}
