import { doc, onSnapshot, type DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";

export function useFirebaseContent(documentName: string) {
  const { i18n } = useTranslation();
  const [data, setData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Слухаємо документ у реальному часі (onSnapshot замість getDoc)
  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(db, "pages", documentName);

    // onSnapshot автоматично оновлює стейт data, коли в базі щось змінюється
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setData(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error(`Помилка завантаження контенту для ${documentName}`, error);
        setIsLoading(false);
      }
    );

    // Відписуємось від Firebase, коли користувач йде зі сторінки
    return () => unsubscribe();
  }, [documentName]);

  // 2. Метод для зручного отримання тексту
  const getText = (path: string, fallbackText: string) => {
    if (!data) {
      return fallbackText;
    }

    const keys = path.split(".");
    let currentLevel = data;

    for (const key of keys) {
      if (!currentLevel || typeof currentLevel !== "object" || !(key in currentLevel)) {
        return fallbackText;
      }
      currentLevel = currentLevel[key];
    }

    const localizedText = currentLevel[i18n.language];
    return localizedText || fallbackText;
  };

  // 👇 Додали повернення `data`, щоб використовувати його у формі редагування
  return { getText, isLoading, data };
}
