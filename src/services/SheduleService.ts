import { db } from "../firebase";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import type { WorkingSchedule } from "../types/workingSchedule";

const SCHEDULE_DOC_ID = "working_hours";
const SETTINGS_COLLECTION = "settings";

/**
 * Підписка на графік роботи в реальному часі.
 * Якщо документа не існує, створює його з дефолтними значеннями.
 */
export const subscribeToSchedule = (callback: (data: WorkingSchedule[]) => void) => {
  const docRef = doc(db, SETTINGS_COLLECTION, SCHEDULE_DOC_ID);
  
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data() as { items: WorkingSchedule[] };
      // Повертаємо масив або порожній список, якщо items не визначено
      callback(data.items || []);
    } else {
      // Дефолтна структура для мультимовності
      const initialData: WorkingSchedule[] = [
        { 
          id: '1', 
          days: { ua: "Пн — Пт", en: "Mon — Fri", de: "Mo — Fr" }, 
          label: { ua: "Робочі дні", en: "Working days", de: "Arbeitstage" }, 
          time: "9:00 — 18:00", 
          isClosed: false 
        },
        { 
          id: '2', 
          days: { ua: "Субота", en: "Saturday", de: "Samstag" }, 
          label: { ua: "Вихідний", en: "Day off", de: "Ruhetag" }, 
          time: "", 
          isClosed: true 
        }
      ];
      // Створюємо документ, якщо його немає
      setDoc(docRef, { items: initialData });
      callback(initialData);
    }
  });
};

/**
 * Збереження всього списку (включаючи додані та видалені елементи)
 */
export const saveSchedule = async (items: WorkingSchedule[]): Promise<void> => {
  const docRef = doc(db, SETTINGS_COLLECTION, SCHEDULE_DOC_ID);
  try {
    await updateDoc(docRef, { items });
  } catch (error) {
    console.error("Помилка збереження:", error);
    // Якщо updateDoc не спрацював (наприклад, документа немає), використовуємо setDoc
    await setDoc(docRef, { items });
  }
};