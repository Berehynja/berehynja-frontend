import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export interface StatuteData {
  url: string | null;
  publicId: string | null;
}

export const subscribeToStatute = (callback: (data: StatuteData | null) => void) => {
  const docRef = doc(db, "documents", "statute");
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as StatuteData);
    } else {
      callback(null);
    }
  });
};

export const updateStatuteDoc = async (data: StatuteData) => {
  const docRef = doc(db, "documents", "statute");
  await setDoc(docRef, data, { merge: true });
};