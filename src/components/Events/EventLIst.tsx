import { useEffect, useState } from "react";
import { AddEvent } from "../Buttons/AddEvent";

import { useAuth } from "../AuthProvider/useAuth";
import { AddEventModal } from "../Modals/AddEventModal";
import { EventCard } from "./EventCard";
import type { Event } from "../../types/event";
import { addEvent, deleteEvent, fetchEvents, updateEvent } from "../../services/eventsService";


export const EventList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const { isAdmin } = useAuth();
  const revertedEvents = [...events].reverse();

  useEffect(() => {
    if (!isAdmin) setIsModalOpen(false);
    const loadData = async () => {
    const [fechedEvents] = await Promise.all([fetchEvents()]);
    setEvents(fechedEvents);
  console.log("🚀 ~ docs:", fechedEvents);
    };
    if (!editingEvent)
    loadData();
  }, [isAdmin, editingEvent]);

 
  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    setEvents((prevEvents) => prevEvents.filter((evt) => evt.id !== eventId));
    console.log("Удаление события с ID:", eventId);
    // Здесь можно добавить логику удаления события из базы данных или состояния
    setEditingEvent(null);
    setIsModalOpen(false);
  };

  const handleSaveEvent = async (eventData: Event) => {
    if (editingEvent) {
      // Логика обновления существующего события
      updateEvent(eventData.id!, eventData);
      setEvents((prevEvents) => prevEvents.map((evt) => (evt.id === eventData.id ? eventData : evt)));
      console.log("Обновление события:", eventData);
    } else {
      // Логика создания нового события
      const newEvent = await addEvent(eventData);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      console.log("Создание нового события:", newEvent);
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
        eventToEdit={editingEvent!}
      />

      <ul className="grid grid-cols-1 items-start justify-center  md:grid-cols-2 md:gap-7">
        {revertedEvents.map((event) => (
          <EventCard key={event.id} event={event} onEdit={handleEditEvent} />
        ))}
      </ul>
    </>
  );
};
