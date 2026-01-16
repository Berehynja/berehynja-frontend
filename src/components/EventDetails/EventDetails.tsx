import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import type { DocumentData } from "firebase/firestore";

export const EventDetails = () => {

const { eventId } = useParams();

const [event, setEvent] = useState<DocumentData | null>(null);

useEffect(() => {
  const getSingleEvent = async () => {
    // 1. Проверяем, нет ли у нас уже этого события (если используешь Context)
    // 2. Если нет — делаем запрос
    if (!eventId) {
      console.log("eventId is undefined!");
      return;
    }
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setEvent(docSnap.data());
    } else {
      console.log("Такого события нет!");
    }
  };

  getSingleEvent();
}, [eventId]);

  return (
    <div className="h-200">
      <h2>EventDetails Component</h2>
      {event ? (
        <pre>{JSON.stringify(event, null, 2)}</pre>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
}