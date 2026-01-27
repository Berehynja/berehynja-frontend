import { useEffect, useState } from "react";
import { AddEvent } from "../Buttons/AddEvent";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";

import { useAuth } from "../AuthProvider/useAuth";
import { upcomingEvents } from "../../data/eventsDate";
import { AddEventModal } from "../Modals/AddEventModal";
import { EventCard } from "./EventCard";


export const EventList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

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

 
  const handleDeleteEvent = (eventId: string) => {
    console.log("Удаление события с ID:", eventId);
    // Здесь можно добавить логику удаления события из базы данных или состояния
    setIsModalOpen(false);
  };

  const handleSaveEvent = (eventData: Event) => {
    if (editingEvent) {
      // Логика обновления существующего события
      console.log("Обновление события:", eventData);
    } else {
      // Логика создания нового события
      console.log("Создание нового события:", eventData);
    }
    setIsModalOpen(false);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  }

  return (
    <>
      {isAdmin && <AddEvent onClick={() => setIsModalOpen(true)} />}

      <AddEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        eventToEdit={editingEvent}
      />

      <ul className="grid grid-cols-1 items-start justify-center  md:grid-cols-2 md:gap-7">
        {revertedEvents.map((event) => (
          <EventCard key={event.id} event={event} onEdit={handleEditEvent} />
        ))}
      </ul>
    </>
  );
};
