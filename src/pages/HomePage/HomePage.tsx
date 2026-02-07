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
          className="flex min-h-75 max-w-120 min-w-85 flex-col items-start justify-between bg-cover bg-center bg-no-repeat p-5 sm:min-h-125 sm:max-w-3xl sm:rounded-b-3xl sm:p-10 md:min-h-150 md:max-w-5xl md:px-4 lg:min-h-175 lg:max-w-7xl lg:px-8 xl:max-w-360 xl:px-10"
          style={{ backgroundImage: `url(${ban})` }}
        >
          <h1 className="mb-4 align-sub text-3xl text-white sm:text-4xl md:text-5xl">
            {t("home.welcome")}
          </h1>

          <p className="block w-full rounded-lg bg-black/50 p-5 indent-8 text-xl leading-8 text-white sm:text-2xl md:text-3xl md:leading-10">
            {t("home.description")}
            {/* Наша мета — створити тепле та дружнє середовище, де кожен
            почуватиметься як вдома, знайде нових друзів та отримає необхідну
            підтримку. */}
          </p>
        </div>
      </section>

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
                <h2 className="font-montserratBold mb-2 text-xl">{newEvent.title}</h2>
                <p className="font-montserratBold text-gray-600">{formatDate(newEvent.date)}</p>
                <p className="font-montserratRegular text-gray-700">{newEvent.description}</p>
              </div>
              <div className="relative h-100 overflow-hidden p-2">
                <img
                  src={newEvent.imageBanner}
                  alt={newEvent.title}
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
