import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("../lib/cli.js", import.meta.url));

function runCli(args = [], env = {}) {
  const result = spawnSync(process.execPath, [CLI, ...args], {
    encoding: "utf8",
    env: { ...process.env, ...env },
  });
  return {
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

const FRIDAY = "2026-12-25";
const WEDNESDAY = "2026-10-14";

describe("agaza CLI", () => {
  describe("human output", () => {
    it("answers for today and exits 0", () => {
      const { status, stdout, stderr } = runCli();
      assert.strictEqual(status, 0);
      assert.ok(stdout.length > 0, "expected something on stdout");
      assert.strictEqual(stderr, "");
    });

    it("says yes for a Friday", () => {
      const { status, stdout } = runCli([FRIDAY]);
      assert.strictEqual(status, 0);
      assert.match(stdout, /^Yes/);
      assert.match(stdout, /Friday/);
    });

    it("says no for a Wednesday and names the next agaza", () => {
      const { status, stdout } = runCli([WEDNESDAY]);
      assert.strictEqual(status, 0);
      assert.match(stdout, /^No/);
      assert.match(stdout, /Friday, 16 Oct 2026/);
    });

    it("answers in Arabic with --lang ar", () => {
      const { status, stdout } = runCli([FRIDAY, "--lang", "ar"]);
      assert.strictEqual(status, 0);
      assert.match(stdout, /أجازة/);
    });

    it("accepts the -l short flag", () => {
      const { status, stdout } = runCli([FRIDAY, "-l", "ar"]);
      assert.strictEqual(status, 0);
      assert.match(stdout, /أجازة/);
    });
  });

  describe("--json", () => {
    it("prints parseable JSON with every documented field", () => {
      const { status, stdout } = runCli([FRIDAY, "--json"]);
      assert.strictEqual(status, 0);

      const output = JSON.parse(stdout);
      assert.deepStrictEqual(Object.keys(output).sort(), [
        "date",
        "isAgaza",
        "nextAgaza",
        "timeUntilAgaza",
        "timeZone",
      ]);
      assert.strictEqual(output.isAgaza, true);
      assert.strictEqual(output.timeZone, "Africa/Cairo");
      assert.strictEqual(typeof output.timeUntilAgaza, "number");
      assert.ok(output.timeUntilAgaza > 0);
      // ISO strings, so they survive JSON and parse back to real dates.
      assert.ok(!Number.isNaN(Date.parse(output.date)));
      assert.ok(!Number.isNaN(Date.parse(output.nextAgaza)));
    });

    it("is English-only, whatever --lang says", () => {
      const withLang = runCli([FRIDAY, "--json", "--lang", "ar"]);
      const withoutLang = runCli([FRIDAY, "--json"]);
      assert.strictEqual(withLang.stdout, withoutLang.stdout);
    });

    it("gives the same answer whatever the machine time zone is", () => {
      const tokyo = runCli([FRIDAY, "--json"], { TZ: "Asia/Tokyo" });
      const newYork = runCli([FRIDAY, "--json"], { TZ: "America/New_York" });
      assert.strictEqual(tokyo.status, 0);
      assert.strictEqual(tokyo.stdout, newYork.stdout);
    });
  });

  describe("--help and --version", () => {
    it("prints usage on stdout and exits 0", () => {
      const { status, stdout, stderr } = runCli(["--help"]);
      assert.strictEqual(status, 0);
      assert.match(stdout, /Usage: agaza/);
      assert.strictEqual(stderr, "");
    });

    it("accepts -h", () => {
      assert.strictEqual(runCli(["-h"]).status, 0);
    });

    it("prints a version and exits 0", () => {
      const { status, stdout } = runCli(["--version"]);
      assert.strictEqual(status, 0);
      assert.match(stdout, /^\d+\.\d+\.\d+/);
    });
  });

  describe("errors", () => {
    const badInputs = [
      { args: ["2026-13-45"], label: "an impossible date" },
      { args: ["25-12-2026"], label: "the wrong date format" },
      { args: ["--lang", "fr"], label: "an unsupported language" },
      { args: ["--wat"], label: "an unknown flag" },
      { args: ["2026-12-25", "2026-12-26"], label: "two dates" },
    ];

    badInputs.forEach(({ args, label }) => {
      it(`exits 1 and writes to stderr for ${label}`, () => {
        const { status, stdout, stderr } = runCli(args);
        assert.strictEqual(status, 1);
        assert.ok(stderr.length > 0, "expected an explanation on stderr");
        // stdout must stay clean so `agaza --json > file` never writes garbage.
        assert.strictEqual(stdout, "");
      });
    });
  });
});
