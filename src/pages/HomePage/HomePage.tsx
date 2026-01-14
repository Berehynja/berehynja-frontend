import { useTranslation } from "react-i18next";
// import { Baner, BanerText, BannerTitele, Hero, HomeContainer } from "./HomePage.styled";
import { HowWeHelp } from "../../components/Sections/HowWeHelp";
import { upcomingEvents } from "../../data/eventsDate";
import ban from "../../images/children.jpg";
import OurMission from "../../components/Sections/OurMission";

export function HomePage() {
  const { t } = useTranslation();
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
      <section>
        <div
          className=" flex flex-col justify-between items-start p-5
          min-w-85 max-w-120 min-h-75 bg-no-repeat bg-cover bg-center 
          sm:max-w-3xl  sm:min-h-125 sm:p-10
          md:px-4 md:max-w-5xl  md:min-h-150
          lg:px-8 lg:max-w-7xl  lg:min-h-175
          xl:px-10 xl:max-w-360  "
          style={{ backgroundImage: `url(${ban})` }}
        >
          <h1 className=" font-montserratBold  text-3xl text-white align-sub mb-4 sm:text-4xl md:text-5xl">
            {t("home.welcome")}
          </h1>

          <p
            className=" block w-full font-montserratRegular text-xl text-white leading-8 bg-black/50  rounded-lg 
            indent-8 p-5 sm:text-2xl md:text-3xl md:leading-10"
          >
            {t("home.description")}
            {/* Наша мета — створити тепле та дружнє середовище, де кожен
            почуватиметься як вдома, знайде нових друзів та отримає необхідну
            підтримку. */}
          </p>
        </div>
      </section>

      <HowWeHelp />
      <OurMission />

      <div className=" flex flex-col w-full justify-center items-center  mt-10 pb-10">
        <h2 className=" text-center text-preset-2 font-montserratBold py-4 mb-6 "> Чекаємо на вас на наступній події! </h2>
        {newEvent && (
          <div className=" w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg ">
            <div className=" p-2">
              <div className="flex flex-col gap-2 p-3">
                <h2 className="text-xl font-montserratBold mb-2">{newEvent.title}</h2>
                <p className=" font-montserratBold text-gray-600">{formatDate(newEvent.date)}</p>
                <p className=" font-montserratRegular text-gray-700">{newEvent.description}</p>
              </div>
              <div className=" h-100 p-2 relative overflow-hidden">
                <img
                  src={newEvent.imageBanner}
                  alt={newEvent.title}
                  className="absolute inset-0 w-full h-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
