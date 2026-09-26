// order matters
export const WEEKEND_DAYS = [5, 6] as const; // Friday | Saturday
export type WeekendDay = (typeof WEEKEND_DAYS)[number]; // 5 | 6

export function isWeekendDay(day: number): day is WeekendDay {
  return (WEEKEND_DAYS as readonly number[]).includes(day);
}

function describeValue(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "object")
    return (value as object).constructor?.name ?? "object";
  return typeof value;
}

export function assertDate(date: unknown): asserts date is Date {
  if (!(date instanceof Date))
    throw new TypeError(
      `agaza: expected a Date, received ${describeValue(date)}`,
    );

  if (Number.isNaN(date.getTime()))
    throw new RangeError("agaza: received an invalid Date");
}
