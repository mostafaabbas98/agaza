// One date per weekday at Cairo midnight (Fri 18 Sep – Thu 24 Sep 2026).
// September is DST in Egypt, so the offset is +03:00.
export const week = {
  Friday: new Date("2026-09-18T00:00:00+03:00"),
  Saturday: new Date("2026-09-19T00:00:00+03:00"),
  Sunday: new Date("2026-09-20T00:00:00+03:00"),
  Monday: new Date("2026-09-21T00:00:00+03:00"),
  Tuesday: new Date("2026-09-22T00:00:00+03:00"),
  Wednesday: new Date("2026-09-23T00:00:00+03:00"),
  Thursday: new Date("2026-09-24T00:00:00+03:00"),
};

export const invalidDates = [
  { value: "not a date", label: "a string", error: TypeError },
  {
    value: new Date("not a date"),
    label: "an invalid date object",
    error: RangeError,
  },
  { value: null, label: "null", error: TypeError },
  { value: 123, label: "a number", error: TypeError },
  { value: {}, label: "an object", error: TypeError },
];

const cairoFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Africa/Cairo",
  hourCycle: "h23",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
});

// "Fri 00:00": what Cairo's wall clock shows at `date`
export function cairoClock(date) {
  return cairoFormatter.format(date).replace(",", "");
}
