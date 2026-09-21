import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAgaza } from "../lib/index.js";
import { invalidDates, week } from "./fixtures.js";

const validDates = [
  { date: week.Friday, expected: true, day: "Friday" },
  { date: week.Saturday, expected: true, day: "Saturday" },
  { date: week.Sunday, expected: false, day: "Sunday" },
  { date: week.Monday, expected: false, day: "Monday" },
  { date: week.Tuesday, expected: false, day: "Tuesday" },
  { date: week.Wednesday, expected: false, day: "Wednesday" },
  { date: week.Thursday, expected: false, day: "Thursday" },
];

describe("isAgaza()", () => {
  describe("return", () => {
    validDates.forEach(({ date, expected, day }) => {
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
