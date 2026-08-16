import { Briefcase, Heart, HouseHeart, School, Users } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { EditTextModal } from "../../Modals/EditTextModal";
import { useFirebaseContent } from "../../../hooks/useFirebaseContent";
import { useAuth } from "../../AuthProvider/useAuth";
import EditButton from "../../Buttons/EditButton";
import type { LangKey } from "../../../types/types";

const EDITOR_LANGUAGES: LangKey[] = ["ua", "de", "en"];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20,
    },
  },
};

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
    <section className="relative my-12 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="relative inline-flex">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            {mainTitle}

            {isAdmin && (
              <EditButton
                onClick={() => setIsTitleOpen(true)}
                className="top-0 -right-1/3 h-8 w-8 border border-gray-200 bg-white text-gray-700 shadow hover:scale-110 hover:bg-blue-600 hover:text-white"
                size={36}
              />
            )}
          </h2>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto my-10 grid w-full auto-rows-fr gap-5 px-3 md:grid-cols-2 md:gap-6 md:px-4 xl:grid-cols-4"
      >
        {cardsConfig.map((card) => {
          const titlePath = `ourMission.cards.${card.id}.title`;
          const subtitlePath = `ourMission.cards.${card.id}.subtitle`;
          const leadPath = `ourMission.cards.${card.id}.lead`;
          const textPath = `ourMission.cards.${card.id}.text`;

          return (
            <motion.aside
              key={card.id}
              variants={cardVariants}
              className={`${card.className} group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200/80 p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(15,23,42,0.13)] md:p-8`}
            >
              {isAdmin && (
                <EditButton
                  onClick={() => setActiveCard(card.id)}
                  className="top-4 right-4 h-12 w-12 border border-gray-200 bg-white text-gray-700 shadow-xl hover:scale-110 hover:bg-blue-600 hover:text-white"
                  size={36}
                />
              )}

              <div className="flex items-center gap-4 pr-10">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-800 shadow-sm">
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl leading-tight font-semibold text-slate-950 md:text-2xl">
                    {isLoading ? "..." : getText(titlePath, t(titlePath))}
                  </h3>
                  <p className="mt-1 text-sm leading-6 font-semibold text-slate-500 md:text-base">
                    {isLoading
                      ? "..."
                      : getText(subtitlePath, t(subtitlePath))}
                  </p>
                </div>
              </div>

              <p className="text-base leading-7 font-semibold text-slate-800 md:text-lg md:leading-8">
                {isLoading ? "..." : getText(leadPath, t(leadPath))}
              </p>
              <p className="text-base leading-7 font-medium text-slate-600">
                {isLoading ? "..." : getText(textPath, t(textPath))}
              </p>
            </motion.aside>
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
          { key: "title", label: "Заголовок", type: "input" },
          { key: "subtitle", label: "Підзаголовок", type: "input" },
          { key: "lead", label: "Лідабзац", type: "textarea" },
          { key: "text", label: "Основний текст", type: "textarea" },
        ]}
      />

      <EditTextModal
        isOpen={isTitleOpen}
        onClose={() => setIsTitleOpen(false)}
        documentName="home"
        sectionName="ourMission"
        modalTitle="Редагування заголовку"
        initialData={editorData.title}
        fields={[{ key: "title", label: "Заголовок", type: "input" }]}
      />
    </section>
  );
}
