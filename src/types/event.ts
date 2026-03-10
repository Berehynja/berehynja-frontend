interface MediaItem {
  id: string;
  url: string;
  alt: string;
  type: "image" | "video";
}

export interface Event {
  id?: string;
  titles: {
    ua: string;
    de: string;
    en: string;
  };
  descriptions: {
    ua: string;
    de: string;
    en: string;
  };
  date: string;
  time: string;
  location: string;
  imageBanner: string;
  images?: MediaItem[];
  videos?: MediaItem[];
}