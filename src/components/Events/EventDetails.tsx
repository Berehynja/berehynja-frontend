// import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { db } from "../../firebase";
import type { DocumentData } from "firebase/firestore";
import { getEventById } from "../../services/eventsService";

export const EventDetails = () => {
  const { eventId } = useParams();

  const [event, setEvent] = useState<DocumentData | null>(null);
  console.log("🚀 ~ event:", event)

  useEffect(() => {
    const getSingleEvent = async () => {
      if (!eventId) {
        console.log("eventId is undefined!");
        return;
      }
      const eventById = await Promise.all([getEventById(eventId)]);
      setEvent(eventById[0]);
    };

    getSingleEvent();
  }, [eventId]);

  return (
    <div className="w-full py-8">
      <div className="mb-10 flex flex-col md:flex-row gap-6">
        <div className="min-h-20 w-full md:w-1/2 overflow-hidden rounded-lg bg-blue-500">
          <img src={event?.imageBanner} alt="banner" />
        </div>
        <div className="flex w-full md:w-1/2 flex-col justify-center pl-6">
          <h2 className="font-montserratBold mb-2 text-xl"> {event?.title}</h2>
          <p className="text-preset-4 mb-4">
            {new Date(event?.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              
              year: "numeric",
            })}
          </p>
          <p className="font-montserratItalic mb-4 text-preset-4">{event?.time} {event?.location}</p>
          <p className="font-montserratBold mb-2 text-lg">{event?.description}</p>
        </div>
      </div>

      <div className="w-full">
        <ul className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <li className="min-h-20 w-full bg-yellow-200">
            <img src={event?.imageBanner} alt="foto" />
          </li>
          <li className="min-h-20 w-full bg-yellow-200">
            <img src={event?.imageBanner } alt="foto" />
          </li>
          <li className="min-h-20 w-full bg-yellow-200">
            <img src={event?.imageBanner} alt="foto" />
          </li>
          <li className="min-h-20 w-full bg-yellow-200">
            <img src={event?.imageBanner} alt="foto" />
          </li>
          <li className="min-h-20 w-full bg-yellow-200">
            <img src={event?.imageBanner} alt="foto" />
          </li>
          <li className="min-h-20 w-full bg-yellow-200">
            <img src={event?.imageBanner} alt="foto" />
          </li>
          <li className="min-h-20 w-full bg-yellow-200">
            <img src={event?.imageBanner} alt="foto" />
          </li>
          <li className="min-h-20 w-full bg-yellow-200">
            <img src={event?.imageBanner} alt="foto" />
          </li>

          <li className="min-h-20 w-full bg-gray-200">
            <video src={event?.imageBanner} controls width="100%" />
          </li>
          <li className="min-h-20 w-full bg-gray-200">
            <video src={event?.imageBanner} controls width="100%" />
          </li>
          <li className="min-h-20 w-full bg-gray-200">
            <video src={event?.imageBanner} controls width="100%" />
          </li>
          <li className="min-h-20 w-full bg-gray-200">
            <video src={event?.imageBanner} controls width="100%" />
          </li>
        </ul>
      </div>
    </div>
  );
};
