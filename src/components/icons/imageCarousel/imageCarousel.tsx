import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface CarouselImage {
  id: string;
  url: string;
  type: "image" | "video";
  alt: string;
}

interface ImageCarouselProps {
  items: CarouselImage[];
}

export function ImageCarousel({ items }: ImageCarouselProps) {
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Скролл лучше делать на ширину одного элемента
  const scroll = (offset: number) => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollLeft += offset;
    }
  };

  return (
    <div className="carouselContainer mx-auto w-full mt-6 bg-gray-100 rounded-lg overflow-hidden">
      <div className="slider relative bg-gray-200 flex items-center justify-center p-2">
        <div
          ref={imageContainerRef}
          className="imageContainer flex overflow-hidden scroll-smooth gap-4"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="min-w-65 h-40 md:min-w-62.5 md:h-40 relative rounded-lg overflow-hidden shadow-md bg-black"
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url} // Убедитесь, что тут ссылка на .mp4
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              )}
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              onClick={() => scroll(-266)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll(266)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-10"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
