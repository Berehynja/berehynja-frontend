import { BookOpen, Calendar, Heart, Users } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useFirebaseContent } from "../../../hooks/useFirebaseContent";
import { EditTextModal } from "../../Modals/EditTextModal";
import { useAuth } from "../../AuthProvider/useAuth";
import EditButton from "../../Buttons/EditButton";
import type { LangKey } from "../../../types/types";

const EDITOR_LANGUAGES: LangKey[] = ["ua", "de", "en"];

const featuresConfig = [
  {
    id: "support",
    Icon: Heart,
    borderColor: "border-t-Blue",
    iconColor: "text-Blue",
  },
  {
    id: "community",
    Icon: Users,
    borderColor: "border-t-Green",
    iconColor: "text-Green",
  },
  {
    id: "integration",
    Icon: BookOpen,
    borderColor: "border-t-Orange",
    iconColor: "text-Orange",
  },
  {
    id: "events",
    Icon: Calendar,
    borderColor: "border-t-Red",
    iconColor: "text-Red",
  },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20,
    },
  },
};

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

export function HowWeHelp() {
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
          title: getEditorText(`howWeHelp.cards.${activeCard}.title`),
          description: getEditorText(
            `howWeHelp.cards.${activeCard}.description`,
          ),
        }
      : {};

    return {
      card: cardData,
      title: {
        title: getEditorText("howWeHelp.title"),
      },
    };
  }, [activeCard, data, i18n, translationsVersion]);

  const mainTitle = getText("howWeHelp.title", t("howWeHelp.title"));

  return (
    <section className="relative my-6 overflow-hidden">
      <div className="relative mx-auto max-w-93.75 px-4 py-6 md:max-w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative text-center"
        >
          <div className="relative inline-flex">
            <h2 className="text-preset-2 mt-0.5 font-semibold xl:mt-2.5">
              {isLoading ? "..." : mainTitle}

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
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {featuresConfig.map((item) => {
            const titlePath = `howWeHelp.cards.${item.id}.title`;
            const descriptionPath = `howWeHelp.cards.${item.id}.description`;

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className={`shadow-card relative h-62.5 w-full rounded-sm border-t-4 bg-white px-8 py-7 ${item.borderColor}`}
              >
                <h3 className="text-preset-3 font-semibold">
                  {isLoading ? "..." : getText(titlePath, t(titlePath))}
                </h3>
                <p className="text-preset-5 mt-5 font-light">
                  {isLoading
                    ? "..."
                    : getText(descriptionPath, t(descriptionPath))}
                </p>

                <div
                  className={`absolute right-8 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 ${item.iconColor}`}
                >
                  <item.Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                {isAdmin && (
                  <EditButton
                    onClick={() => setActiveCard(item.id)}
                    className="top-4 right-4 h-12 w-12 border border-gray-200 bg-white text-gray-700 shadow-xl hover:scale-110 hover:bg-blue-600 hover:text-white"
                    size={36}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <EditTextModal
        isOpen={Boolean(activeCard)}
        onClose={() => setActiveCard(null)}
        documentName="home"
        sectionName={`howWeHelp.cards.${activeCard}`}
        modalTitle="Редагування картки"
        initialData={editorData.card}
        fields={[
          { key: "title", label: "Заголовок", type: "input" },
          { key: "description", label: "Опис", type: "textarea" },
        ]}
      />

      <EditTextModal
        isOpen={isTitleOpen}
        onClose={() => setIsTitleOpen(false)}
        documentName="home"
        sectionName="howWeHelp"
        modalTitle="Редагування заголовку"
        initialData={editorData.title}
        fields={[{ key: "title", label: "Заголовок", type: "input" }]}
      />
    </section>
  );
}
