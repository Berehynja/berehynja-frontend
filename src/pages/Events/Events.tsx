import { EventCard } from "../../components";

export const Events = () => {
  return (
    <div className="w-full py-8">
      <div className="font-montserratBold flex flex-col items-center justify-center gap-8 py-7 md:flex-row md:py-10">
        <div className="flex flex-col items-center justify-center text-nowrap">
          <h1 className="text-preset-2 font-montserratBold flex flex-nowrap justify-center pb-4">
            Події{" "}
          </h1>{" "}
          <div className="mb-4 h-1 w-24 bg-linear-to-r from-blue-500 to-yellow-400"></div>
        </div>

        <p className="text-preset-4 flex max-w-4xl items-center justify-center px-4 leading-8 md:px-0">
          Приєднайтеся до наших громадських заходів, святкування та діяльності, розроблених для
          об'єднання людей, підтримки нашої місії.
        </p>
      </div>

      <section className="flex w-full flex-col items-center justify-center gap-8 md:gap-12">
        <EventCard />
      </section>
    </div>
  );
};
