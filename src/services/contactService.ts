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
        city: "Bad Oeynhausen",
        instagram: "https://www.instagram.com/berehynja.de",
        telegram: "https://t.me/bereginia_de",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.342981326442!2d8.7994689!3d52.2008399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ba133a8c5e933d%3A0xc3c9f28d546222b!2sWeserstra%C3%9Fe%2024%2C%2032545%20Bad%20Oeynhausen!5e0!3m2!1sen!2sde!4v1710000000000!5m2!1sen!2sde" // Додаємо дефолтне значення для mapUrl
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