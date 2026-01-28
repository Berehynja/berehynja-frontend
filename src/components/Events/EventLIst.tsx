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
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  const revertedEvents = [...events].reverse();

  useEffect(() => {
    if (!isAdmin && isModalOpen) {
      handleCloseModal(); // Если не админ, но модалка открыта — закрываем её
    }
    setIsLoading(true);
    const loadData = async () => {
      try {
        const [fechedEvents] = await Promise.all([fetchEvents()]);
        setEvents(fechedEvents);
      } catch (error) {
        console.error("Помилка при завантаженні подій:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isAdmin, isModalOpen]);

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm("Ви впевнені?")) return;
    await deleteEvent(eventId);
    try {
      setEvents((prevEvents) => prevEvents.filter((evt) => evt.id !== eventId));
      console.log("Удаление события с ID:", eventId);
      handleCloseModal();
    } catch (error) {
      console.error("Помилка видалення:", error);
    }
  };

  const handleSaveEvent = async (eventData: Event) => {
    try {
      if (editingEvent) {
        // Логика обновления существующего события
        await updateEvent(eventData.id!, eventData);
        setEvents((prevEvents) =>
          prevEvents.map((evt) => (evt.id === eventData.id ? eventData : evt))
        );
        console.log("Обновление события:", eventData);
      } else {
        // Логика создания нового события
        await addEvent(eventData);
        // setEvents((prevEvents) => [...prevEvents, newEvent]);
        console.log("Создание нового события:", eventData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Помилка збереження події:", error);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingEvent(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {isAdmin && (
        <AddEvent
          onClick={() => {
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
        />
      )}

      <AddEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        eventToEdit={editingEvent}
      />
      {isLoading ? (
        <div className="h-10"> Loading... </div>
      ) : (
        <ul className="grid grid-cols-1 items-start justify-center md:grid-cols-2 md:gap-7">
          {revertedEvents.map((event) => (
            <EventCard key={event.id} event={event} onEdit={handleEditEvent} />
          ))}
        </ul>
      )}
    </>
  );
};
