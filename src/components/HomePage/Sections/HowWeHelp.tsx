import { BookOpen, Calendar, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useFirebaseContent } from "../../../hooks/useFirebaseContent";
import { EditTextModal } from "../../Modals/EditTextModal";
import { useAuth } from "../../AuthProvider/useAuth";
import EditButton from "../../Buttons/EditButton";
import type { LangKey } from "../../../types/types";

const EDITOR_LANGUAGES: LangKey[] = ["ua", "de", "en"];

const TEXT_LIMITS = {
  sectionTitle: 60,
  cardTitle: 25,
  cardDescription: 180,
} as const;

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
    <section className="relative w-full overflow-visible">
      <div className="relative mx-auto w-full px-3 md:px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative text-center"
        >
          <div
            className={`relative mx-auto w-fit max-w-full ${isAdmin ? "pr-12" : ""}`}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {isLoading ? "..." : mainTitle}
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
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-4"
        >
          {featuresConfig.map((item) => {
            const titlePath = `howWeHelp.cards.${item.id}.title`;
            const descriptionPath = `howWeHelp.cards.${item.id}.description`;

            return (
              <div
                key={item.id}
                className={`relative flex min-h-68 w-full flex-col overflow-hidden rounded-2xl border border-slate-200 border-t-4 bg-white p-6 pb-20 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-500 ease-out hover:z-10 hover:-translate-y-2 hover:shadow-[0_26px_64px_rgba(15,23,42,0.22)] md:rounded-3xl md:p-7 md:pb-20 ${item.borderColor}`}
              >
                <h3 className="min-w-0 pr-10 text-xl leading-tight font-semibold wrap-break-word text-slate-950 md:text-2xl">
                  {isLoading ? "..." : getText(titlePath, t(titlePath))}
                </h3>
                <p className="mt-4 min-w-0 text-base leading-7 font-medium wrap-break-word text-slate-600">
                  {isLoading
                    ? "..."
                    : getText(descriptionPath, t(descriptionPath))}
                </p>

                <div
                  className={`absolute right-6 bottom-6 flex size-12 items-center justify-center rounded-2xl bg-slate-100 shadow-sm md:right-7 md:bottom-7 ${item.iconColor}`}
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
              </div>
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
          {
            key: "title",
            label: "Заголовок",
            type: "input",
            maxLength: TEXT_LIMITS.cardTitle,
          },
          {
            key: "description",
            label: "Опис",
            type: "textarea",
            maxLength: TEXT_LIMITS.cardDescription,
          },
        ]}
      />

      <EditTextModal
        isOpen={isTitleOpen}
        onClose={() => setIsTitleOpen(false)}
        documentName="home"
        sectionName="howWeHelp"
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
