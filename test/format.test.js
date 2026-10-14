import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseDate, formatDuration } from "../lib/format.js";

describe("parseDate()", () => {
  it("returns a UTC-midnight Date for valid date 2026-12-25", () => {
    const date = parseDate("2026-12-25");
    assert.ok(date instanceof Date);
    assert.strictEqual(date.getUTCFullYear(), 2026);
    assert.strictEqual(date.getUTCMonth(), 11);
    assert.strictEqual(date.getUTCDate(), 25);
    assert.strictEqual(date.getUTCHours(), 0);
    assert.strictEqual(date.getUTCMinutes(), 0);
    assert.strictEqual(date.getUTCSeconds(), 0);
    assert.strictEqual(date.getUTCMilliseconds(), 0);
  });

  it("returns undefined for invalid leap day 2026-02-29", () => {
    const date = parseDate("2026-02-29");
    assert.strictEqual(date, undefined);
  });

  it("returns undefined for impossible date 2026-02-30", () => {
    const date = parseDate("2026-02-30");
    assert.strictEqual(date, undefined);
  });

  it("returns undefined for wrong format 26-1-1", () => {
    const date = parseDate("26-1-1");
    assert.strictEqual(date, undefined);
  });
});

describe("formatDuration()", () => {
  it("returns '1 minute' for 1 ms", () => {
    const result = formatDuration(1);
    assert.strictEqual(result, "1 minute");
  });

  it("returns '1 hour' for exactly 60 minutes", () => {
    const result = formatDuration(60 * 60 * 1000);
    assert.strictEqual(result, "1 hour");
  });

  it("returns '2 days' for exactly 2 days", () => {
    const result = formatDuration(2 * 24 * 60 * 60 * 1000);
    assert.strictEqual(result, "2 days");
  });

  it("returns Arabic for 1h, 2h, and 3h", () => {
    assert.strictEqual(formatDuration(1 * 60 * 60 * 1000, "ar"), "ساعة");
    assert.strictEqual(formatDuration(2 * 60 * 60 * 1000, "ar"), "ساعتين");
    assert.strictEqual(formatDuration(3 * 60 * 60 * 1000, "ar"), "٣ ساعات");
  });

  it("returns Arabic list joining for 1 day + 5 hours", () => {
    const duration = 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000;
    const result = formatDuration(duration, "ar");
    assert.strictEqual(result, "يوم و٥ ساعات");
  });
});
