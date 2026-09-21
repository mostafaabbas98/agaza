// order matters
export const WEEKEND_DAYS = [5, 6] as const; // Friday | Saturday
export type WeekendDay = (typeof WEEKEND_DAYS)[number]; // 5 | 6

export function isWeekendDay(day: number): day is WeekendDay {
  return (WEEKEND_DAYS as readonly number[]).includes(day);
}

export function isDate(date: unknown): date is Date {
  return date instanceof Date && !Number.isNaN(date.getTime());
}
