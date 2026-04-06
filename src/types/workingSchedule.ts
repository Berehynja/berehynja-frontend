export interface WorkingSchedule {
  id: string;
  days: { ua: string; en: string; de: string };
  label: { ua: string; en: string; de: string };
  time: string;
  isClosed: boolean;
}