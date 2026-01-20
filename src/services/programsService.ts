import { addDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import type { AgeGroup } from "../types/ageGroup";
import type { Program } from "../types/program";


// Назви колекцій у базі даних
const AGE_GROUPS_COLLECTION = "ageGroups";
const PROGRAMS_COLLECTION = "programs";

export const programsService = {
    // 1. Отримати список вікових груп (для чекбоксів у модалці)
    getAgeGroups: async (): Promise<AgeGroup[]> => {
        try {
            const q = query(collection(db, AGE_GROUPS_COLLECTION), orderBy("order","asc"));
            const snapshot = await getDocs(q);

            return snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data(),
            })) as AgeGroup[];
        
        } catch (error) {
            console.error("Помилка при завантаженні вікових груп:", error);
      return [];
        }
    },

    // 2. Створити нову програму
    addProgram: async(programData: Omit<Program, "id">): Promise<Program> => {
        try {
            const docRef = await addDoc(collection(db, PROGRAMS_COLLECTION), programData);

            return {
                id: docRef.id,
                ...programData
            };
        } catch (error) {
            console.error("Помилка при створенні програми:", error);
            throw error;
        }
    },

    // 3. Отримати всі програми (для відображення карток)
    getPrograms: async(): Promise<Program[]> => {
        try {
            const snapshot = await getDocs(collection(db, PROGRAMS_COLLECTION));

            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Program[];
        } catch (error) {
            console.error("Помилка при завантаженні програм:", error);
            return [];
        }
    }

};