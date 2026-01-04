import { ImageCarousel } from "../../components/icons/imageCarousel/imageCarousel";
import { upcomingEvents } from "../../data/eventsDate";

export const Events = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

        <p className="flex justify-center items-center max-w-3xl text-preset-4 px-4 md:px-0 leading-8">
          "Приєднайтеся до наших громадських заходів, святкування та діяльності,
          розроблених для об'єднання людей"
        </p>
      </div>

      <section className="flex w-full flex-col justify-center items-center gap-8 md:gap-12 ">
        <ul className="w-full grid grid-cols mg:grid-cols-2 justify-center items-center gap-8 md:gap-12 ">
          {upcomingEvents.map((event) => (
            <li
              key={event.id}
              className=" w-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg shadow-md transition-shadow duration-300"
            >

              <div className=" p-2 border-b border-gray-200">
                <div className=" p-3">
                  <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                  <p className="text-gray-600">{formatDate(event.date)}</p>
                  <p className="text-gray-700">{event.description}</p>
                </div>
                <div className=" h-100 p-2 relative overflow-hidden">
                <img
                  src={event.imageBanner}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
                { (event.images?.length !== 0 || event.videos?.length !== 0) && <ImageCarousel items={[...(event.images || []), ...(event.videos || [])]} /> }
              </div>
            </li>
          ))}
        </ul>

        {/* {event.images && event.images.length > 0 && (
                <img src={event.images[0].url} alt={event.images[0].alt} />
              )} */}
      </section>
    </div>
  );
};
