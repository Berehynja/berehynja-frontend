import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType as EmblaApiType } from 'embla-carousel';
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
    align: 'start',
    containScroll: 'trimSnaps',
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
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative group bg-gray-50 rounded-xl mt-2 ">
      {/* Окно просмотра (Viewport) */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Контейнер для слайдов (Canvas) */}
        <div className="flex -ml-4"> 
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex-[0_0_100%] min-w-0 pl-4 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%]"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-md bg-black">
                {item.type === "image" ? (
                  <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
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
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg z-20 hover:bg-white transition-all"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
      )}

      {/* Кнопка ВПЕРЕД */}
      {canScrollNext && (
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg z-20 hover:bg-white transition-all"
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
    <div className="relative w-full h-full bg-black group/video overflow-hidden">
      <video
        ref={videoRef}
        src={item.url}
        poster={item.poster}
        // Оставляем контроли всегда, чтобы они были доступны
        controls
        className="w-full h-full object-cover"
        preload="metadata"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Кнопка PLAY (только когда видео на паузе) */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer z-10 py-12"
          onClick={togglePlay}
        >
          <div className="bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/30 group-hover/video:scale-110 transition-transform duration-300 flex items-center justify-center">
            <Play size={30} className="text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* ЗОНА ПАУЗЫ (когда видео играет) 
          Мы делаем её прозрачной и ограничиваем по высоте (h-3/4), 
          чтобы она физически не доходила до нижней полосы управления.
      */}
      {isPlaying && (
        <div 
          className="absolute top-0 left-0 w-full h-[80%] cursor-pointer z-0" 
          onClick={togglePlay}
        />
      )}
    </div>
  );
}