import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextAgaza } from "../lib/index.js";
import { invalidDates, week } from "./fixtures.js";

const nextFriday = new Date(2026, 8, 25); // Fri 25 Sep 2026

const validDates = [
  { date: week.Sunday, expected: nextFriday, label: "Sunday" },
  { date: week.Monday, expected: nextFriday, label: "Monday" },
  { date: week.Tuesday, expected: nextFriday, label: "Tuesday" },
  {
    date: new Date(2026, 8, 23, 15, 30),
    expected: nextFriday,
    label: "Wednesday 15:30",
  },
  {
    date: new Date(2026, 8, 24, 23, 59, 59),
    expected: nextFriday,
    label: "Thursday 23:59:59",
  },
  {
    date: new Date(2026, 8, 18, 10, 0, 0),
    expected: nextFriday,
    label: "Friday",
  },
  {
    date: new Date(2026, 8, 19, 23, 59, 59),
    expected: nextFriday,
    label: "Saturday",
  },
  {
    date: new Date(2026, 11, 28, 0, 0, 0),
    expected: new Date(2027, 0, 1),
    label: "Mon 28 Dec 2026",
  },
];

describe("nextAgaza()", () => {
  describe("return", () => {
    validDates.forEach(({ date, expected, label }) => {
      it(`returns ${expected.toDateString()} for ${label}`, () => {
        assert.deepStrictEqual(nextAgaza(date), expected);
      });
    });
  });

  // throw error tests
  describe("throw", () => {
    invalidDates.forEach((invalidDate) => {
      it(`throws an error if the date is ${invalidDate.label}`, () => {
        assert.throws(() => nextAgaza(invalidDate.value), {
          name: "Error",
          message: "Invalid date",
        });
      });
    });
  });

  // edge cases
  // date not mutable
  it("does not mutate the input date", () => {
    const input = new Date(2026, 8, 23, 15, 30);
    const copy = new Date(input);
    nextAgaza(input);
    assert.deepStrictEqual(input, copy);
  });
});
