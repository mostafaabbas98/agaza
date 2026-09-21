// One date per weekday at local midnight (Fri 18 Sep – Thu 24 Sep 2026).
export const week = {
  Friday: new Date(2026, 8, 18),
  Saturday: new Date(2026, 8, 19),
  Sunday: new Date(2026, 8, 20),
  Monday: new Date(2026, 8, 21),
  Tuesday: new Date(2026, 8, 22),
  Wednesday: new Date(2026, 8, 23),
  Thursday: new Date(2026, 8, 24),
};

export const invalidDates = [
  { value: "not a date", label: "a string" },
  { value: new Date("not a date"), label: "an invalid date object" },
  { value: null, label: "null" },
  { value: 123, label: "a number" },
  { value: {}, label: "an object" },
];
