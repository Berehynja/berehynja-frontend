import { useEffect, useState } from "react";
import { AddEvent } from "../Buttons/AddEvent";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";

import { useAuth } from "../AuthProvider/useAuth";
import { upcomingEvents } from "../../data/eventsDate";
import { AddEventModal } from "../Modals/AddEventModal";
import { EventCard } from "./EventCard";

type EventType = {
  id: string;
  title: string;
  date: string;
  imageBanner: string;
  description: string;
  images?: { id: string; url: string; type: "image"; alt: string }[];
  videos?: { id: string; url: string; type: "video"; alt: string }[];
};

export const EventList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAdmin } = useAuth();
  const revertedEvents = [...upcomingEvents].reverse();

  useEffect(() => {
    if (!isAdmin) setIsModalOpen(false);
    const fetchEvents = async () => {
      const colRef = collection(db, "events ");

      // 2. Получаем "снимок" всей коллекции
      const querySnapshot = await getDocs(colRef);
      const docsData = querySnapshot.docs.map((doc) => doc.data());
      console.log("Данные всех документов в коллекции:", docsData);
    };
    fetchEvents();
  }, [isAdmin]);

  const handleCreate = () => {
    setIsModalOpen(true); // Открываем
  };

  

  return (
    <>
      {isAdmin && <AddEvent onClick={handleCreate} />}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(event: EventType) => {
          // Здесь можно добавить логику сохранения события
          console.log("Создано новое событие:", event);
          setIsModalOpen(false);
        }}
      />
      <ul className="grid grid-cols-1 items-start justify-center gap-8 md:grid-cols-2 md:gap-15">
        {revertedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
          />
        ))}
      </ul>
    </>
  );
};
