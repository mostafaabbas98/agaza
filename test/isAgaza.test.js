import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAgaza } from "../lib/index.js";

describe("isAgaza()", () => {
  const dates = [
    { date: new Date(2026, 8, 18), expected: true, day: "Friday" },
    { date: new Date(2026, 8, 19), expected: true, day: "Saturday" },
    { date: new Date(2026, 8, 20), expected: false, day: "Sunday" },
    { date: new Date(2026, 8, 21), expected: false, day: "Monday" },
    { date: new Date(2026, 8, 22), expected: false, day: "Tuesday" },
    { date: new Date(2026, 8, 23), expected: false, day: "Wednesday" },
    { date: new Date(2026, 8, 24), expected: false, day: "Thursday" },
  ];

  describe("return", () => {
    dates.forEach(({ date, expected, day }) => {
      it(`returns ${expected} for ${day}`, () => {
        assert.strictEqual(isAgaza(date), expected);
      });
    });
  });

  describe("default", () => {
    it("defaults to today's date", () => {
      assert.strictEqual(isAgaza(), isAgaza(new Date()));
    });
  });

  // throw error tests
  const invalidDates = [
    { value: "not a date", label: "a string" },
    { value: new Date("not a date"), label: "an invalid date object" },
    { value: null, label: "null" },
    { value: 123, label: "a number" },
    { value: {}, label: "an object" },
  ];

  describe("throw", () => {
    invalidDates.forEach((invalidDate) => {
      it(`throws an error if the date is ${invalidDate.label}`, () => {
        assert.throws(() => isAgaza(invalidDate.value), {
          name: "Error",
          message: "Invalid date",
        });
      });
    });
  });

  // edge cases (undefined)
  describe("edge cases", () => {
    it("undefined treats as today's date", () => {
      assert.strictEqual(isAgaza(undefined), isAgaza());
    });
  });
});
