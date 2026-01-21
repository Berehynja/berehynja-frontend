export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageBanner?: string;
}

// export interface Program {
//   id: string;
//   title: string;
//   day: string;
//   time: string;
//   description: string;
//   instructor?: string;
// }

export type Page = 'home' | 'about' | 'programs' | 'events' | 'contact';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
}