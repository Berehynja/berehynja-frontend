import { db } from "../firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query 
} from "firebase/firestore";
import type { Partner } from "../types/partners";

const COLLECTION_NAME = "partners";

export const subscribeToPartners = (callback: (partners: Partner[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME));
  return onSnapshot(q, (snapshot) => {
    const partnersData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Partner[];
    callback(partnersData);
  });
};

export const addPartner = async (partner: Omit<Partner, 'id'>) => {
  return await addDoc(collection(db, COLLECTION_NAME), partner);
};

export const deletePartner = async (id: string) => {
  return await deleteDoc(doc(db, COLLECTION_NAME, id));
};