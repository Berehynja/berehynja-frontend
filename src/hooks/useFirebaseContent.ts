import { doc, onSnapshot, type DocumentData } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { db } from "../firebase";
import type { LangKey } from "../types/types";

const SUPPORTED_LANGUAGES: LangKey[] = ["ua", "de", "en"];

const resolveLanguage = (language?: string): LangKey => {
  const languageCode = (language || "ua").split("-")[0].toLowerCase();

  if (languageCode === "uk") return "ua";

  return SUPPORTED_LANGUAGES.includes(languageCode as LangKey)
    ? (languageCode as LangKey)
    : "ua";
};

export function useFirebaseContent(documentName: string) {
  const { i18n } = useTranslation();
  const [data, setData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const documentReference = doc(db, "pages", documentName);
    const unsubscribe = onSnapshot(
      documentReference,
      (documentSnapshot) => {
        setData(documentSnapshot.exists() ? documentSnapshot.data() : null);
        setIsLoading(false);
      },
      (error) => {
        console.error(
          `Помилка завантаження контенту для ${documentName}`,
          error,
        );
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [documentName]);

  const getText = useCallback(
    (path: string, fallbackText: string) => {
      if (!data) return fallbackText;

      const value = path.split(".").reduce<unknown>((currentValue, key) => {
        if (
          !currentValue ||
          typeof currentValue !== "object" ||
          !(key in currentValue)
        ) {
          return undefined;
        }

        return (currentValue as Record<string, unknown>)[key];
      }, data);

      // Підтримка старих записів, де текст зберігався звичайним рядком.
      if (typeof value === "string") return value || fallbackText;

      if (!value || typeof value !== "object") return fallbackText;

      const currentLanguage = resolveLanguage(
        i18n.resolvedLanguage || i18n.language,
      );
      const localizedValue = (value as Partial<Record<LangKey, unknown>>)[
        currentLanguage
      ];

      return typeof localizedValue === "string" && localizedValue.trim()
        ? localizedValue
        : fallbackText;
    },
    [data, i18n.language, i18n.resolvedLanguage],
  );

  return { getText, isLoading, data };
}
