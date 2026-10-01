import {
  assertDate,
  isWeekendDay,
  WEEKEND_DAYS,
  cairoParts,
  cairoOffset,
} from "./helper.js";

/**
 * Check if a date falls on the Egyptian weekend (Friday/Saturday).
 * @param date The date to check.
 * @returns `true` if the date is a Friday or Saturday or `false` otherwise.
 * @throws {TypeError} If `date` is not a `Date` object.
 * @throws {RangeError} If `date` is an invalid date (for example `new Date("not a date")`).
 */
export function isAgaza(date: Date = new Date()): boolean {
  assertDate(date);
  return isWeekendDay(cairoParts(date).weekday);
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
 * @returns The next Friday 00:00 in Cairo. If it is an agaza, the next week's Friday will be returned.
 * If midnight doesn't exist due to DST, the first instant of that Friday (01:00) is returned.
 * @throws {TypeError} If `date` is not a `Date` object.
 * @throws {RangeError} If `date` is an invalid date (for example `new Date("not a date")`).
 */
export function nextAgaza(date: Date = new Date()): Date {
  assertDate(date);

  const now = cairoParts(date);
  const daysUntilFriday = (WEEKEND_DAYS[0] - now.weekday + 7) % 7 || 7;

  // Friday 00:00 on Cairo's wall clock, written as if it were UTC
  const wallAsUTC = Date.UTC(
    now.year,
    now.month - 1,
    now.day + daysUntilFriday,
  );

  // Guess with today's offset, then re-measure it in case DST changed in between
  const guess = wallAsUTC - cairoOffset(date);
  const corrected = wallAsUTC - cairoOffset(new Date(guess));

  // When Friday 00:00 doesn't exist (DST start), the correction lands on
  // Thursday 23:00, and the guess is Friday 01:00, the first instant of Friday.
  return new Date(
    cairoParts(new Date(corrected)).weekday === WEEKEND_DAYS[0]
      ? corrected
      : guess,
  );
}
