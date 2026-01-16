import { Link } from "react-router-dom";
import { ImageCarousel } from "../../components/icons/imageCarousel/imageCarousel";
import { upcomingEvents } from "../../data/eventsDate";

export const EventCard = () => {
    const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return <ul className=" flex flex-col-reverse w-full justify-center items-center  gap-8 md:gap-15 ">
          {upcomingEvents.map((event) => (
            <li
              key={event.id}
              className=" w-full p-4 bg-lime-50 border border-gray-300 rounded-lg overflow-hidden shadow-lg "
            >

              <Link to={`/events/${event.id}`} className=" block">
                <div className=" p-3">
                  <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                  <p className="text-gray-600">{formatDate(event.date)}</p>
                  <p className="text-gray-700">{event.description}</p>
                </div>
                <div className=" h-100 p-2 relative overflow-hidden">
                <img
                  src={event.imageBanner}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full rounded-lg object-cover"
                />
              </div>
              </Link>
                { (event.images?.length !== 0 || event.videos?.length !== 0) && <ImageCarousel items={[...(event.images || []), ...(event.videos || [])]} /> }
              
            </li>
          ))}
        </ul>;
}