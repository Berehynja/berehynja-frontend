// import { Baner, BanerText, BannerTitele, Hero, HomeContainer } from "./HomePage.styled";

import { HowWeHelp } from "../../components/Sections/HowWeHelp";
import { upcomingEvents } from "../../data/eventsDate";

import OurMission from "../../components/Sections/OurMission";
import { Hero } from "../../components/Hero/Hero";
import { useTranslation } from "react-i18next";

export function HomePage() {

  const { i18n } = useTranslation();
  const newEvent = upcomingEvents.at(-1);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Hero />

      <HowWeHelp />
      <OurMission />

      <div className="mt-10 flex w-full flex-col items-center justify-center pb-10">
        <h2 className="text-preset-2 font-montserratBold mb-6 py-4 text-center">
          {" "}
          Чекаємо на вас на наступній події!{" "}
        </h2>
        {newEvent && (
          <div className="w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
            <div className="p-2">
              <div className="flex flex-col gap-2 p-3">
                <h2 className="font-montserratBold mb-2 text-xl">{newEvent.titles}</h2>
                <p className="font-montserratBold text-gray-600">{formatDate(newEvent.date)}</p>
                <p className="font-montserratRegular text-gray-700">{newEvent.descriptions}</p>
              </div>
              <div className="relative h-100 overflow-hidden p-2">
                <img
                  src={newEvent.imageBanner}
                  alt='Подія'
                  className="absolute inset-0 h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
