import { useEffect } from "react";

import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { ImageCarousel } from "../../components/icons/imageCarousel/imageCarousel";
import { upcomingEvents } from "../../data/eventsDate";

export const EventCard = () => {
  useEffect(() => {
    const fetchEvents = async () => {
      const colRef = collection(db, "events ");

      // 2. Получаем "снимок" всей коллекции
      const querySnapshot = await getDocs(colRef);
      const docsData = querySnapshot.docs.map((doc) => doc.data());
      console.log("Данные всех документов в коллекции:", docsData);
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <ul className="flex w-full flex-col-reverse items-center justify-center gap-8 md:gap-15">
      {upcomingEvents.map((event) => (
        <li
          key={event.id}
          className="w-full overflow-hidden rounded-lg border border-gray-300 bg-lime-50 p-4 shadow-lg"
        >
          <Link to={`/events/${event.id}`} className="block">
            <div className="p-3">
              <h2 className="mb-2 text-xl font-bold">{event.title}</h2>
              <p className="text-gray-600">{formatDate(event.date)}</p>
              <p className="text-gray-700">{event.description}</p>
            </div>
            <div className="relative h-100 overflow-hidden p-2">
              <img
                src={event.imageBanner}
                alt={event.title}
                className="absolute inset-0 h-full w-full rounded-lg object-cover"
              />
            </div>
          </Link>
          {(event.images?.length !== 0 || event.videos?.length !== 0) && (
            <ImageCarousel items={[...(event.images || []), ...(event.videos || [])]} />
          )}
        </li>
      ))}
    </ul>
  );
};
