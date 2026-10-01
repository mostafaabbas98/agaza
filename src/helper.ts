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

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const cairoFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Africa/Cairo",
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  weekday: "short",
});

// { year, month, day, hour, minute, second, weekday }
export function cairoParts(date: Date) {
  const parts: Record<string, string> = {};
  for (const { type, value } of cairoFormatter.formatToParts(date)) {
    parts[type] = value;
  }

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: WEEKDAYS.indexOf(parts.weekday),
  };
}

// How far Cairo's wall clock is ahead of UTC at `date`, in ms (+2h or +3h).
export function cairoOffset(date: Date): number {
  const parts = cairoParts(date);
  const wallAsUTC = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  const instant = Math.floor(date.getTime() / 1000) * 1000;
  return wallAsUTC - instant;
}
