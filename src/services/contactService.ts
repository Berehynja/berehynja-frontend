import { db } from "../firebase";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import type { ContactData } from "../types/contactData";


const CONTACTS_DOC_ID = "main_contacts";
const SETTINGS_COLLECTION = "settings";

export const subscribeToContacts = (callback: (data: ContactData) => void) => {
  const docRef = doc(db, SETTINGS_COLLECTION, CONTACTS_DOC_ID);
  
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as ContactData);
    } else {
      const initial: ContactData = {
        email: "bereginia.badoeynhausen@gmail.com",
        phone: "+4915128161383",
        address: "Weserstraße 24",
        city: "Bad Oeynhausen"
      };
      setDoc(docRef, initial);
      callback(initial);
    }
  });
};

export const saveContacts = async (data: ContactData): Promise<void> => {
  const docRef = doc(db, SETTINGS_COLLECTION, CONTACTS_DOC_ID);
  await updateDoc(docRef, { ...data });
};