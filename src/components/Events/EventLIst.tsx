import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AddEvent } from "../Buttons/AddEvent";
import { useAuth } from "../AuthProvider/useAuth";
import { AddEventModal } from "../Modals/AddEventModal";
import { PageLoader } from "../ui/PageLoader";
import { EventCard } from "./EventCard";
import {
  addEvent,
  deleteEvent,
  fetchEvents,
  updateEvent,
} from "../../services/eventsService";
import type { Event } from "../../types/event";
import type { LangKey } from "../../types/types";

const EVENT_LIST_TEXT = {
  add: {
    ua: "Додати подію",
    de: "Veranstaltung hinzufügen",
    en: "Add event",
  },
  empty: {
    ua: "Наразі немає подій.",
    de: "Derzeit gibt es keine Veranstaltungen.",
    en: "There are currently no events.",
  },
  confirmDelete: {
    ua: "Видалити цю подію?",
    de: "Diese Veranstaltung löschen?",
    en: "Delete this event?",
  },
};

export const EventList = () => {
  const { isAdmin } = useAuth();
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const detectedLanguage = (i18n.resolvedLanguage || i18n.language).split(
    "-",
  )[0];
  const currentLang: LangKey = ["ua", "de", "en"].includes(detectedLanguage)
    ? (detectedLanguage as LangKey)
    : "ua";

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Помилка при завантаженні подій:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingEvent(null);
    setIsModalOpen(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (
      isProcessing ||
      !window.confirm(EVENT_LIST_TEXT.confirmDelete[currentLang])
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      await deleteEvent(eventId);
      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventId),
      );
      handleCloseModal();
    } catch (error) {
      console.error("Помилка видалення події:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEvent = async (eventData: Event) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      if (editingEvent && eventData.id) {
        await updateEvent(eventData.id, eventData);
        setEvents((currentEvents) =>
          currentEvents.map((event) =>
            event.id === eventData.id ? eventData : event,
          ),
        );
      } else {
        const newEvent = await addEvent(eventData);
        setEvents((currentEvents) => [...currentEvents, newEvent]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Помилка збереження події:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const reversedEvents = [...events].reverse();

  return (
    <>
      <PageLoader visible={isLoading || isProcessing} />

      {isAdmin && (
        <AddEventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          eventToEdit={editingEvent}
        />
      )}

      {!isLoading && (reversedEvents.length > 0 || isAdmin) && (
        <ul className="grid w-full grid-cols-1 items-stretch justify-center gap-6 md:grid-cols-2 md:gap-7 xl:grid-cols-3 xl:gap-10">
          {isAdmin && (
            <li className="min-h-80">
              <AddEvent
                onClick={handleOpenCreate}
                label={EVENT_LIST_TEXT.add[currentLang]}
              />
            </li>
          )}

          {reversedEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              priority={index === 0}
            />
          ))}
        </ul>
      )}

      {!isLoading && reversedEvents.length === 0 && !isAdmin && (
        <p className="py-12 text-center text-gray-500">
          {EVENT_LIST_TEXT.empty[currentLang]}
        </p>
      )}
    </>
  );
};
