/**
 * Повертає дату найближчої неділі у форматі "ДД.ММ.РРРР" (uk-UA)
 */
export const getNextSundayDate = (): string => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Якщо сьогодні неділя (0), залишаємо 0, інакше рахуємо дні до неділі
  const daysUntilNextSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilNextSunday);

  return nextSunday.toLocaleDateString("uk-UA");
};
