import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextAgaza } from "../lib/index.js";
import { cairoClock, invalidDates, week } from "./fixtures.js";

const nextFriday = new Date("2026-09-25T00:00:00+03:00"); // Fri 25 Sep 2026, Cairo

const validDates = [
  { date: week.Sunday, expected: nextFriday, label: "Sunday" },
  { date: week.Monday, expected: nextFriday, label: "Monday" },
  { date: week.Tuesday, expected: nextFriday, label: "Tuesday" },
  {
    date: new Date("2026-09-23T15:30:00+03:00"),
    expected: nextFriday,
    label: "Wednesday 15:30",
  },
  {
    date: new Date("2026-09-24T23:59:59+03:00"),
    expected: nextFriday,
    label: "Thursday 23:59:59",
  },
  {
    date: new Date("2026-09-18T10:00:00+03:00"),
    expected: nextFriday,
    label: "Friday",
  },
  {
    date: new Date("2026-09-19T23:59:59+03:00"),
    expected: nextFriday,
    label: "Saturday",
  },
  {
    // December is outside DST in Egypt, so the offset is +02:00
    date: new Date("2026-12-28T00:00:00+02:00"),
    expected: new Date("2027-01-01T00:00:00+02:00"),
    label: "Mon 28 Dec 2026",
  },
];

describe("nextAgaza()", () => {
  describe("return", () => {
    validDates.forEach(({ date, expected, label }) => {
      it(`returns ${expected.toISOString()} for ${label}`, () => {
        const result = nextAgaza(date);
        assert.strictEqual(result.getTime(), expected.getTime());
        assert.strictEqual(cairoClock(result), "Fri 00:00");
      });
    });
  });

  // throw error tests
  describe("throw", () => {
    invalidDates.forEach((invalidDate) => {
      it(`throws an error if the date is ${invalidDate.label}`, () => {
        assert.throws(() => nextAgaza(invalidDate.value), invalidDate.error);
      });

      it(`${invalidDate.error.name} is an instance of Error`, () => {
        assert.ok(new invalidDate.error() instanceof Error);
      });
    });
  });

  // edge cases
  // date not mutable
  it("does not mutate the input date", () => {
    const input = new Date("2026-09-23T15:30:00+03:00");
    const copy = new Date(input);
    nextAgaza(input);
    assert.deepStrictEqual(input, copy);
  });
});
