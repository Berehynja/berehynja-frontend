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
    <div className="w-full py-8">
      <div className="mb-6 flex gap-6 p-4">
        <div className="h-90 w-1/2 overflow-hidden rounded-lg bg-blue-500">
          <img src={event?.imageBanner || ""} alt="banner" />
        </div>
        <div className="flex w-1/2 flex-col justify-center pl-6">
          <h2 className="font-montserratBold mb-2 text-xl">Titel</h2>
          <p className="font-montserratBold mb-2 text-lg"> {event?.title} </p>
          <p className="text-preset-4 mb-4">
            {" "}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore consequatur ratione
            minima, sed quaerat veniam a eveniet, tenetur vitae velit earum ab, nostrum quae libero
            eligendi exercitationem quas voluptas! Magnam. Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Labore consequatur ratione minima, sed quaerat veniam a eveniet,
            tenetur vitae velit earum ab, nostrum quae libero eligendi exercitationem quas voluptas!
            Magnam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore consequatur
            ratione minima, sed quaerat veniam a eveniet, tenetur vitae velit earum ab, nostrum quae
            libero eligendi exercitationem quas voluptas! Magnam.{" "}
          </p>
        </div>
      </div>

      <div className="w-full">
        <ul className="grid w-full grid-cols-4 gap-6">
          <li className="h-50 w-full bg-yellow-200">
            <img src={event?.imageBanner || ""} alt="foto" />
          </li>
          <li className="h-50 w-full bg-yellow-200">
            <img src={event?.imageBanner || ""} alt="foto" />
          </li>
          <li className="h-50 w-full bg-yellow-200">
            <img src={event?.imageBanner || ""} alt="foto" />
          </li>
          <li className="h-50 w-full bg-yellow-200">
            <img src={event?.imageBanner || ""} alt="foto" />
          </li>
          <li className="h-50 w-full bg-yellow-200">
            <img src={event?.imageBanner || ""} alt="foto" />
          </li>
          <li className="h-50 w-full bg-yellow-200">
            <img src={event?.imageBanner || ""} alt="foto" />
          </li>
          <li className="h-50 w-full bg-yellow-200">
            <img src={event?.imageBanner || ""} alt="foto" />
          </li>
          <li className="h-50 w-full bg-yellow-200">
            <img src={event?.imageBanner || ""} alt="foto" />
          </li>

          <li className="h-40 w-full bg-gray-200">
            <video src={event?.imageBanner || ""} controls width="100%" />
          </li>
          <li className="h-40 w-full bg-gray-200">
            <video src={event?.imageBanner || ""} controls width="100%" />
          </li>
          <li className="h-40 w-full bg-gray-200">
            <video src={event?.imageBanner || ""} controls width="100%" />
          </li>
          <li className="h-40 w-full bg-gray-200">
            <video src={event?.imageBanner || ""} controls width="100%" />
          </li>
        </ul>
      </div>
    </div>
  );
};
