import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Ваш шлях до конфігу Firebase
import type { ScheduleItem } from "../types/scheduleItem";

const COLLECTION_NAME = "schedules";

export const scheduleService = {
  // 1. Отримати весь розклад
  getSchedules: async (): Promise<ScheduleItem[]> => {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ScheduleItem[];
  },

  // 2. Додати нове заняття в розклад
  addSchedule: async (scheduleData: Omit<ScheduleItem, "id">): Promise<ScheduleItem> => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), scheduleData);
    return {
      id: docRef.id,
      ...scheduleData,
    };
  },

  // 3. Оновити існуючий запис у розкладі
  updateSchedule: async (id: string, scheduleData: Partial<ScheduleItem>): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, scheduleData);
  },

  // 4. Видалити запис із розкладу
  deleteSchedule: async (id: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
