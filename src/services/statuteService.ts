import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Определяем интерфейс для данных устава
export interface StatuteData {
  url: string | null;
  publicId: string | null;
}

// Теперь callback принимает либо StatuteData, либо null
export const subscribeToStatute = (callback: (data: StatuteData | null) => void) => {
  const docRef = doc(db, "documents", "statute");
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      // Приводим данные к нашему интерфейсу
      callback(docSnap.data() as StatuteData);
    } else {
      callback(null);
    }
  });
};

// Функция обновления принимает только данные нашего типа
export const updateStatuteDoc = async (data: StatuteData) => {
  const docRef = doc(db, "documents", "statute");
  // Использование { merge: true } корректно обновляет только переданные поля
  await setDoc(docRef, data, { merge: true });
};