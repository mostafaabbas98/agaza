import { assertDate, isWeekendDay, WEEKEND_DAYS } from "./helper.js";

/**
 * Check if a date falls on the Egyptian weekend (Friday/Saturday).
 * @param date The date to check.
 * @returns `true` if the date is a Friday or Saturday or `false` otherwise.
 * @throws {TypeError} If `date` is not a `Date` object.
 * @throws {RangeError} If `date` is an invalid date (for example `new Date("not a date")`).
 */
export function isAgaza(date: Date = new Date()): boolean {
  assertDate(date);
  return isWeekendDay(date.getDay());
}

/**
 * How much time is left until the next agaza?
 * @param date The date to check.
 * @returns The number of milliseconds until the next agaza.
 * @throws {TypeError} If `date` is not a `Date` object.
 * @throws {RangeError} If `date` is an invalid date (for example `new Date("not a date")`).
 */
export function timeUntilAgaza(date: Date = new Date()): number {
  return nextAgaza(date).getTime() - date.getTime();
}

/**
 * Get the next agaza date.
 * @param date The date to check.
 * @returns The next agaza date. If it is an agaza, the next Friday 00:00 will be returned.
 * @throws {TypeError} If `date` is not a `Date` object.
 * @throws {RangeError} If `date` is an invalid date (for example `new Date("not a date")`).
 */
export function nextAgaza(date: Date = new Date()): Date {
  assertDate(date);
  const day = date.getDay();
  const daysUntilFriday = (WEEKEND_DAYS[0] - day + 7) % 7 || 7;

  const nextFriday = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + daysUntilFriday,
  );
  return nextFriday;
}
