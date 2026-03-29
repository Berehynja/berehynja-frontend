import { getDocs, collection, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { ProgramAdults } from "../types/program";

const PROGRAMS_ADULTS_COLLECTION = "programs_adults";

// Отримати всі програми для дорослих
export const fetchProgramsAdults = async (): Promise<ProgramAdults[]> => {
  try {
    const snapshot = await getDocs(collection(db, PROGRAMS_ADULTS_COLLECTION));
    const programs = snapshot?.docs.map((doc) => ({
      id: doc.id,
        ...doc.data(),
    })) as ProgramAdults[];
    console.log("🚀 ~ programs:", programs)
    return programs;
  } 
    catch (error) {
    console.error("Помилка при завантаженні програм для дорослих:", error);
    return [];
  }
};

// Додати нову програму для дорослих
export const addProgramAdults = async (programData: Omit<ProgramAdults, "id">): Promise<ProgramAdults> => {
  try {
    // 1. Створюємо документ у Firebase (отримуємо посилання з ID)
    const docRef = await addDoc(collection(db, PROGRAMS_ADULTS_COLLECTION), programData);
    
    // 2. ОДРАЗУ записуємо цей ID всередину документа в базі
    await updateDoc(docRef, { id: docRef.id });

    // 3. Повертаємо об'єкт уже з ID
    return {
      id: docRef.id,
      ...programData,
    } as ProgramAdults;
  } catch (error) {
    console.error("Помилка при створенні програми для дорослих:", error);
    throw error;
  }
};


// Отримати програму для дорослих за ID
export const getProgramAdultsById = async (programId: string): Promise<ProgramAdults | null> => {
  try { 
    const docRef = doc(db, PROGRAMS_ADULTS_COLLECTION, programId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return {
        id: docSnap.id,
        ...docSnap.data(),
      } as ProgramAdults;
    }   
    return null;
  } catch (error) {
    console.error("Помилка при отриманні програми для дорослих за ID:", error);
    return null;
  }
};

// Оновити дані програми для дорослих
export const updateProgramAdults = async (programId: string, updatedData: Partial<ProgramAdults>): Promise<void> => {
  try {
    const docRef = doc(db, PROGRAMS_ADULTS_COLLECTION, programId);
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error("Помилка при оновленні програми для дорослих:", error);
    throw error;
  }
};



// Видалити програму для дорослих
export const deleteProgramAdults = async (programId: string): Promise<void> => {
  try {    const docRef = doc(db, PROGRAMS_ADULTS_COLLECTION, programId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Помилка при видаленні програми для дорослих:", error);
    throw error;
  } 
};
