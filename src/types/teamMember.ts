export interface TeamMember {
  id?: string; // Унікальний ідентифікатор для кожного члена команди
  name: {ua: string; en: string; de: string}; // Ім'я з підтримкою української та англійської
  role: {ua: string; en: string; de: string}; // Роль з підтримкою української та англійської
  description: {ua: string; en: string; de: string}; // Опис з підтримкою української та англійської
  skills: {ua: string[]; en: string[]; de: string[]}; // Навички з підтримкою української та англійської
  education: {ua: string; en: string; de: string}; // Освіта з підтримкою української та англійської
  image?: string; // Опциональное поле для будущего
}