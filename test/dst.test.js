import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { isAgaza, timeUntilAgaza, nextAgaza } from "../lib/index.js";
import { cairoClock } from "./fixtures.js";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Every expected value is an instant, so results must be identical on any machine.
const MACHINE_TIME_ZONES = [
  "Africa/Cairo",
  "UTC",
  "America/New_York",
  "Europe/London",
];

MACHINE_TIME_ZONES.forEach((timeZone) => {
  describe(`machine time zone: ${timeZone}`, () => {
    before(() => {
      process.env.TZ = timeZone;
    });

    it("the machine time zone is really switched", () => {
      assert.strictEqual(
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        timeZone,
      );
    });

    describe("Cairo's calendar, not the machine's", () => {
      // Thursday 23:00 in London is already Friday 01:00 in Cairo.
      it("Thursday 23:00 London (Friday 01:00 Cairo) is agaza", () => {
        const date = new Date("2026-01-15T23:00:00Z");
        assert.strictEqual(cairoClock(date), "Fri 01:00");
        assert.strictEqual(isAgaza(date), true);
      });

      it("Thursday 21:30 UTC (Friday 00:30 Cairo) returns next week's Friday", () => {
        const result = nextAgaza(new Date("2026-10-01T21:30:05Z"));
        assert.strictEqual(result.toISOString(), "2026-10-08T21:00:00.000Z");
      });
    });

    // DST ends Thursday Oct 29 at 24:00: clocks go back to 23:00, so Thursday is 25h long.
    describe("DST ends (Oct 29 2026)", () => {
      it("Thursday 00:00 returns 25 hours, not DAY", () => {
        assert.strictEqual(
          timeUntilAgaza(new Date("2026-10-28T21:00:00Z")),
          25 * HOUR,
        );
      });

      it("Sunday 00:00 returns 5 days + 1 hour", () => {
        assert.strictEqual(
          timeUntilAgaza(new Date("2026-10-24T21:00:00Z")),
          5 * DAY + HOUR,
        );
      });

      it("Thursday 23:30 (first occurrence) returns 1.5 hours", () => {
        assert.strictEqual(
          timeUntilAgaza(new Date("2026-10-29T20:30:00Z")),
          HOUR + 30 * MINUTE,
        );
      });

      it("Friday 00:00 returns next week's Friday", () => {
        assert.strictEqual(
          timeUntilAgaza(new Date("2026-10-29T22:00:00Z")),
          7 * DAY,
        );
      });

      describe("nextAgaza()", () => {
        it("Thursday 00:00 returns Friday 00:00 after the 25-hour Thursday", () => {
          const result = nextAgaza(new Date("2026-10-28T21:00:00Z"));
          assert.strictEqual(cairoClock(result), "Fri 00:00");
          assert.strictEqual(result.toISOString(), "2026-10-29T22:00:00.000Z");
        });

        it("Thursday 23:30 (second occurrence) returns Friday 00:00", () => {
          const secondOccurrence = new Date("2026-10-29T21:30:00Z");
          assert.strictEqual(cairoClock(secondOccurrence), "Thu 23:30");
          assert.strictEqual(
            nextAgaza(secondOccurrence).toISOString(),
            "2026-10-29T22:00:00.000Z",
          );
        });

        it("Friday 00:00 returns next week's Friday 00:00", () => {
          const result = nextAgaza(new Date("2026-10-29T22:00:00Z"));
          assert.strictEqual(result.toISOString(), "2026-11-05T22:00:00.000Z");
        });
      });
    });

    // DST starts Friday Apr 24 at 00:00: clocks jump to 01:00, so Friday 00:00 doesn't exist.
    describe("DST starts (Apr 24 2026)", () => {
      it("Friday 01:00 is agaza and returns next week's Friday", () => {
        const date = new Date("2026-04-23T22:00:00Z");
        assert.strictEqual(cairoClock(date), "Fri 01:00");
        assert.strictEqual(isAgaza(date), true);
        assert.strictEqual(timeUntilAgaza(date), 7 * DAY - HOUR);
      });

      it("Thursday 23:59:59 returns 1 second", () => {
        assert.strictEqual(
          timeUntilAgaza(new Date("2026-04-23T21:59:59Z")),
          SECOND,
        );
      });

      it("Thursday 00:00 returns 24 hours (the lost hour is Friday's)", () => {
        assert.strictEqual(
          timeUntilAgaza(new Date("2026-04-22T22:00:00Z")),
          DAY,
        );
      });

      describe("nextAgaza()", () => {
        // Thursday 24:00 (UTC+2) and Friday 01:00 (UTC+3) are the same instant.
        it("Thursday returns Friday 01:00, the first moment of Friday", () => {
          const result = nextAgaza(new Date("2026-04-23T10:00:00Z"));
          assert.strictEqual(cairoClock(result), "Fri 01:00");
          assert.strictEqual(result.toISOString(), "2026-04-23T22:00:00.000Z");
        });

        it("Friday 01:00 returns next week's Friday 00:00 (UTC+3)", () => {
          const result = nextAgaza(new Date("2026-04-23T22:00:00Z"));
          assert.strictEqual(cairoClock(result), "Fri 00:00");
          assert.strictEqual(result.toISOString(), "2026-04-30T21:00:00.000Z");
        });
      });
    });

    it("every hour of 2026 returns the first instant of the next Cairo Friday", () => {
      for (
        let time = Date.UTC(2026, 0, 1);
        time < Date.UTC(2027, 0, 1);
        time += HOUR
      ) {
        const date = new Date(time);
        const result = nextAgaza(date);
        const label = date.toISOString();

        assert.match(cairoClock(result), /^Fri/, label);
        assert.match(cairoClock(new Date(result - 1)), /^Thu/, label);
        assert.ok(result > date, label);
        // a week containing the 25-hour Thursday (DST end) is 7 days + 1 hour
        assert.ok(result - date <= 7 * DAY + HOUR, label);
      }
    });
  });
});
