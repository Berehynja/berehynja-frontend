import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export interface BankDetails {
  name: string;
  bank: string;
  iban: string;
  bic: string;
  purpose: string;
}

const docRef = doc(db, "settings", "bank");

// Зверни увагу: тепер ми кажемо, що data може бути null
export const subscribeToBankDetails = (callback: (data: BankDetails | null) => void) => {
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as BankDetails);
    } else {
      // Якщо документа ще немає в базі, віддаємо null
      callback(null);
    }
  });
};

export const saveBankDetails = async (data: BankDetails) => {
  return await setDoc(docRef, data, { merge: true });
};