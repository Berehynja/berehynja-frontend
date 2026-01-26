export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageBanner?: string;
  images?: Array<{ id: string; url: string; type: "image"; alt: string }>;
  videos?: Array<{ id: string; url: string; type: "video"; alt: string }>
}