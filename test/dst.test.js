process.env.TZ = "Africa/Cairo";

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAgaza, timeUntilAgaza } from "../lib/index.js";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("DST in Africa/Cairo", () => {
  // DST ends Thursday Oct 29 at 24:00: clocks go back to 23:00, so Thursday is 25h long.
  describe("DST ends (Oct 29 2026)", () => {
    it("Thursday 00:00 returns 25 hours, not DAY", () => {
      assert.strictEqual(timeUntilAgaza(new Date(2026, 9, 29)), 25 * HOUR);
    });

    it("Sunday 00:00 returns 5 days + 1 hour", () => {
      assert.strictEqual(timeUntilAgaza(new Date(2026, 9, 25)), 5 * DAY + HOUR);
    });

    it("Thursday 23:30 (first occurrence) returns 1.5 hours", () => {
      assert.strictEqual(
        timeUntilAgaza(new Date(2026, 9, 29, 23, 30)),
        HOUR + 30 * MINUTE,
      );
    });

    it("Friday 00:00 returns 0", () => {
      assert.strictEqual(timeUntilAgaza(new Date(2026, 9, 30)), 0);
    });
  });

  // DST starts Friday Apr 24 at 00:00: clocks jump to 01:00, so Friday 00:00 doesn't exist.
  describe("DST starts (Apr 24 2026)", () => {
    it("new Date(2026, 3, 24) resolves to Friday 01:00", () => {
      const date = new Date(2026, 3, 24);
      assert.strictEqual(date.getDay(), 5);
      assert.strictEqual(date.getHours(), 1);
    });

    it("Friday (resolved to 01:00) is agaza and returns 0", () => {
      const date = new Date(2026, 3, 24);
      assert.strictEqual(isAgaza(date), true);
      assert.strictEqual(timeUntilAgaza(date), 0);
    });

    it("Thursday 23:59:59 returns 1 second", () => {
      assert.strictEqual(
        timeUntilAgaza(new Date(2026, 3, 23, 23, 59, 59)),
        SECOND,
      );
    });

    it("Thursday 00:00 returns 24 hours (the lost hour is Friday's)", () => {
      assert.strictEqual(timeUntilAgaza(new Date(2026, 3, 23)), DAY);
    });
  });
});
