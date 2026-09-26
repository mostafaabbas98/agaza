import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { timeUntilAgaza } from "../lib/index.js";
import { invalidDates, week } from "./fixtures.js";

const SECOND = 1000;
const HOUR = 60 * 60 * SECOND;
const DAY = 24 * HOUR;

// each weekday at midnight
const weekDates = [
  { date: week.Friday, expected: 7 * DAY, label: "Friday" },
  { date: week.Saturday, expected: 6 * DAY, label: "Saturday" },
  { date: week.Sunday, expected: 5 * DAY, label: "Sunday" },
  { date: week.Monday, expected: 4 * DAY, label: "Monday" },
  { date: week.Tuesday, expected: 3 * DAY, label: "Tuesday" },
  { date: week.Wednesday, expected: 2 * DAY, label: "Wednesday" },
  { date: week.Thursday, expected: DAY, label: "Thursday" },
];

const validDates = [
  ...weekDates,
  {
    date: new Date(2026, 8, 24, 23, 59, 59),
    expected: SECOND,
    label: "Thursday 23:59:59 (1 second)",
  },
  {
    date: new Date(2026, 8, 20, 8, 0, 0),
    expected: 4 * DAY + 16 * HOUR,
    label: "Sunday 08:00 (almost 5 days)",
  },
];

describe("timeUntilAgaza()", () => {
  describe("return", () => {
    validDates.forEach(({ date, expected, label }) => {
      it(`returns ${expected}ms for ${label}`, () => {
        assert.strictEqual(timeUntilAgaza(date), expected);
      });
    });
  });

  // throw error tests
  describe("throw", () => {
    invalidDates.forEach((invalidDate) => {
      it(`throws an error if the date is ${invalidDate.label}`, () => {
        assert.throws(
          () => timeUntilAgaza(invalidDate.value),
          invalidDate.error,
        );
      });

      it(`${invalidDate.error.name} is an instance of Error`, () => {
        assert.ok(new invalidDate.error() instanceof Error);
      });
    });
  });
});
