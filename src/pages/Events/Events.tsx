
import { EventCard } from "../../components";

export const Events = () => {
 

  return (
    <div className="w-full py-8">
      <div
        className="flex flex-col justify-center items-center gap-8 py-7 md:py-10 font-montserratBold  
      md:flex-row "
      >
        <div className="flex flex-col text-nowrap justify-center items-center ">
          <h1 className="flex flex-nowrap  text-preset-2 font-montserratBold pb-4 justify-center ">
            Події{" "}
          </h1>{" "}
          <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-yellow-400  mb-4"></div>
        </div>

        <p className="flex justify-center items-center max-w-4xl text-preset-4 px-4 md:px-0 leading-8">
          Приєднайтеся до наших громадських заходів, святкування та діяльності,
          розроблених для об'єднання людей, підтримки нашої місії.
        </p>
      </div>

      <section className="flex w-full flex-col justify-center items-center gap-8 md:gap-12 ">
        <EventCard />
      </section>
    </div>
  );
};
