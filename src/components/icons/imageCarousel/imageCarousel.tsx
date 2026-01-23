import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType as EmblaApiType } from "embla-carousel";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef } from "react";

// --- ТИПЫ ДАННЫХ ---
interface CarouselItem {
  id: string;
  url: string;
  type: "image" | "video";
  alt: string;
  poster?: string;
}

interface ImageCarouselProps {
  items: CarouselItem[];
}

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export function ImageCarousel({ items }: ImageCarouselProps) {
  // Инициализация Embla
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Функция обновления состояния кнопок
  const onSelect = useCallback((api: EmblaApiType) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="group mg:mt-4 relative mt-2 rounded-xl bg-lime-50">
      {/* Окно просмотра (Viewport) */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Контейнер для слайдов (Canvas) */}
        <div className="-ml-4 flex">
          {items.map((item) => (
            <div
              key={item.id}
              className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%]"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg bg-black shadow-md">
                {item.type === "image" ? (
                  <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                ) : (
                  <VideoPlayer item={item} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопка НАЗАД */}
      {canScrollPrev && (
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute top-1/2 left-6 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
      )}

      {/* Кнопка ВПЕРЕД */}
      {canScrollNext && (
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute top-1/2 right-6 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white"
        >
          <ChevronRight size={24} className="text-gray-800" />
        </button>
      )}
    </div>
  );
}

// --- КОМПОНЕНТ ВИДЕОПЛЕЕРА ---
function VideoPlayer({ item }: { item: CarouselItem }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    // Останавливаем всплытие, чтобы слайдер не переключился
    e.stopPropagation();

    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="group/video relative h-full w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={item.url}
        poster={item.poster}
        // Оставляем контроли всегда, чтобы они были доступны
        controls
        className="h-full w-full object-cover"
        preload="metadata"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Кнопка PLAY (только когда видео на паузе) */}
      {!isPlaying && (
        <div
          className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/50 py-12"
          onClick={togglePlay}
        >
          <div className="flex items-center justify-center rounded-full border border-white/30 bg-white/10 p-3 backdrop-blur-md transition-transform duration-300 group-hover/video:scale-110">
            <Play size={30} className="ml-1 fill-white text-white" />
          </div>
        </div>
      )}

      {/* ЗОНА ПАУЗЫ (когда видео играет) 
          Мы делаем её прозрачной и ограничиваем по высоте (h-3/4), 
          чтобы она физически не доходила до нижней полосы управления.
      */}
      {isPlaying && (
        <div
          className="absolute top-0 left-0 z-0 h-[80%] w-full cursor-pointer"
          onClick={togglePlay}
        />
      )}
    </div>
  );
}
