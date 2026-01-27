import { getDocs, collection, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Event } from "../types/event";

// Назва колекції у базі даних

const EVENTS_COLLECTION = "events";


  // Отримати всі події
  export const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, EVENTS_COLLECTION));
        const events = snapshot?.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        
        return events;  
      } catch (error) {
        console.error("Помилка при завантаженні подій:", error);
        return [];
      }
    };

    // Додати нову подію
    export const addEvent = async (eventData: Omit<Event, "id">): Promise<Event> => {
      try {
        const docRef = await addDoc(collection(db, EVENTS_COLLECTION), eventData);
        return {
          id: docRef.id,
          ...eventData,
        };
      } catch (error) {
        console.error("Помилка при створенні події:", error);
        throw error;
      }
    };

    // Отримати подію за ID
    export const getEventById = async (eventId: string): Promise<Event | null> => {
      try {
        const docRef = doc(db, EVENTS_COLLECTION, eventId);
        const docSnap = await getDoc(docRef);   
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            ...docSnap.data(),
          } as Event;
        } else {
          return null;
        }
        } catch (error) {
        console.error("Помилка при отриманні події за ID:", error);
        throw error;
      }
    };

    // Видалити подію
    export const deleteEvent = async (eventId: string): Promise<void> => {
      try {
        const eventRef = doc(db, EVENTS_COLLECTION, eventId);
        await deleteDoc(eventRef);
      } catch (error) {
        console.error("Помилка при видаленні події:", error);
        throw error;
      }
    };

    // Оновити існуючу подію
    export const updateEvent = async (eventId: string, eventData: Omit<Event, "id">): Promise<void> => {
      try {
        const eventRef = doc(db, EVENTS_COLLECTION, eventId);   
        await updateDoc(eventRef, eventData);
        } catch (error) {
        console.error("Помилка при оновленні події:", error);
        throw error;
      }
    };