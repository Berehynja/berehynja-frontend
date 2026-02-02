export interface TeamMember {
  name: string;
  role: string;
  description: string;
  skills: string[];
  education: string;
  image?: string; // Опциональное поле для будущего
}