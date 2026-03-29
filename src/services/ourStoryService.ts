import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { AboutContent } from "../types/aboutContent";


const ABOUT_DOC_ID = "about";
const CONTENT_COLLECTION = "content";

export const fetchAboutContent = async (): Promise<AboutContent | null> => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, ABOUT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Використовуємо "as AboutContent" тільки після перевірки на існування
      return docSnap.data() as AboutContent;
    }
    return null;
  } catch (error) {
    console.error("Error fetching about content:", error);
    return null;
  }
};

export const updateAboutContent = async (data: Partial<AboutContent>): Promise<void> => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, ABOUT_DOC_ID);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error("Error updating about content:", error);
    throw error;
  }
};