import { getDocs, collection, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { TeamMember } from "../types/team";

export const TEAM_COLLECTION = "team";

// Отримати всіх членів команди
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const snapshot = await getDocs(collection(db, TEAM_COLLECTION));
    const members = snapshot?.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TeamMember[];
    console.log("🚀 ~ members:", members)
    return members;
  } catch (error) {
    console.error("Помилка при завантаженні членів команди:", error);
    return [];
  }
};

// Додати нового члена команди
export const addTeamMember = async (memberData: Omit<TeamMember, "id">): Promise<TeamMember> => {
  try {
    const docRef = await addDoc(collection(db, TEAM_COLLECTION), memberData);
    return {
      id: docRef.id,
      ...memberData,
    };
  } catch (error) {
    console.error("Помилка при створенні члена команди:", error);
    throw error;
  }
};

// Отримати члена команди за ID
export const getTeamMemberById = async (memberId: string): Promise<TeamMember | null> => {
  try { 
    const docRef = doc(db, TEAM_COLLECTION, memberId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as TeamMember;
    }
    return null;
  } catch (error) {
    console.error("Помилка при отриманні члена команди:", error);
    return null;
  }
};

// Оновити дані члена команди
export const updateTeamMember = async (memberId: string, updatedData: Partial<TeamMember>): Promise<void> => {
  try {
    const docRef = doc(db, TEAM_COLLECTION, memberId);
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error("Помилка при оновленні члена команди:", error);
    throw error;
  } 
};

// Видалити члена команди
export const deleteTeamMember = async (memberId: string): Promise<void> => {
  try {
    const docRef = doc(db, TEAM_COLLECTION, memberId);      
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Помилка при видаленні члена команди:", error);
    throw error;
  }
};