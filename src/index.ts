import { isDate, isWeekendDay, WEEKEND_DAYS } from "./helper.js";

/**
 * Check if a date falls on the Egyptian weekend (Friday/Saturday).
 * @param date The date to check.
 * @returns `true` if the date is a Friday or Saturday or `false` otherwise.
 * @throws An error if `date` is not a `Date` object or is an invalid date (for example `new Date("not a date")`).
 */
export function isAgaza(date: Date = new Date()): boolean {
  if (!isDate(date)) {
    throw new Error("Invalid date");
  }
  return isWeekendDay(date.getDay());
}

/**
 * How much time is left until the next agaza?
 * @param date The date to check.
 * @returns The number of milliseconds until the next agaza or 0 if it is an agaza.
 * @throws An error if `date` is not a `Date` object or is an invalid date (for example `new Date("not a date")`).
 */
export function timeUntilAgaza(date: Date = new Date()): number {
  if (!isDate(date)) {
    throw new Error("Invalid date");
  }
  const day = date.getDay();

  if (isWeekendDay(day)) {
    return 0;
  }

  // calc ms until next agaza WEEKEND_DAYS[0] (Friday 00:00)
  const nextAgaza = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + (WEEKEND_DAYS[0] - day),
  );
  return nextAgaza.getTime() - date.getTime();
}
