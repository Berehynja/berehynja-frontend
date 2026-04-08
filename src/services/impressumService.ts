import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import type { ImpressumData } from "../types/impressumData";

const docRef = doc(db, "settings", "impressum");

export const subscribeToImpressum = (callback: (data: ImpressumData) => void) => {
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) callback(doc.data() as ImpressumData);
  });
};

export const saveImpressum = async (data: ImpressumData) => {
  return await setDoc(docRef, data, { merge: true });
};