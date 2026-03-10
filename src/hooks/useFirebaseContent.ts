import { doc, getDoc, type DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";

export function useFirebaseContent(documentName: string) {
  const { i18n } = useTranslation();
  const [data, setData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Отримуємо весь документ (з усіма мовами) з колекції "pages"
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "pages", documentName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        }
      } catch (error) {
        console.error(`Помилка завантаження контенту для ${documentName}`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [documentName]);
  // Ми не додаємо i18n.language в залежності useEffect,
  // бо ми стягуємо документ одразу з УСІМА мовами. Це економить запити до Firebase!

  // 2. Метод для зручного отримання тексту
  const getText = (path: string, fallbackText: string) => {
    if (!data) {
      return fallbackText; // Якщо дані ще не завантажились, повертаємо запасний текст
    }

    // Розбиваємо шлях (наприклад, "hero.title" -> ['hero', 'title'])
    const keys = path.split(".");
    let currentLevel = data;

    // Спускаємось вглиб об'єкта
    for (const key of keys) {
      if (!currentLevel || typeof currentLevel !== "object" || !(key in currentLevel))
        return fallbackText; // Якщо на якомусь рівні немає потрібного ключа, повертаємо запасний текст{
      currentLevel = currentLevel[key];
    }

    // Тепер currentLevel — це об'єкт типу { uk: "...", en: "...", de: "..." }
    const localizedText = currentLevel[i18n.language];
    return localizedText || fallbackText; // Якщо для поточної мови немає тексту, повертаємо запасний текст
  };

  return { getText, isLoading };
}
