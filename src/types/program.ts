import type { LessonColor } from "../data/colors";
import type { IconName } from "../data/icons";

export interface Program {
  id: string;
  title: string;
  description?: string;
  color: LessonColor;

  // Зв'язок з віковими групами (зберігаємо тільки ID)
  ageGroupIds: string[];

  iconName: IconName;
}
