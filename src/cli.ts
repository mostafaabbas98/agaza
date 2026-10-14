#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { stderr, stdout } from "node:process";
import { parseArgs, styleText } from "node:util";
import { formatDuration, parseDate } from "./format.ts";
import * as agaza from "./index.ts";

type Color = Parameters<typeof styleText>[0];

function log(msg: string, color?: Color) {
  console.log(color ? styleText(color, msg, { stream: stdout }) : msg);
}

function logError(msg: string) {
  console.error(styleText("red", msg, { stream: stderr }));
}

function displayHelp() {
  log(`Usage: agaza [date] [options]

Arguments:
  [date] - Optional. A day to check, as YYYY-MM-DD. Omit it to ask about right now.
  
Options:
  -l, --lang <en|ar>  Language of the output (default: en)
  -j, --json          Machine-readable output
  -h, --help          Display help text
  -v, --version       Output the version number`);
}

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      json: {
        type: "boolean",
        default: false,
        short: "j",
      },
      lang: {
        type: "string",
        default: "en",
        short: "l",
      },
      help: {
        type: "boolean",
        default: false,
        short: "h",
      },
      version: {
        type: "boolean",
        default: false,
        short: "v",
      },
    },
  });

  if (values.help) {
    displayHelp();
  } else if (values.version) {
    const packageJson = await readFile(
      new URL("../package.json", import.meta.url),
      "utf-8",
    );
    const version = JSON.parse(packageJson).version;
    log(version);
  } else {
    if (values.lang !== "en" && values.lang !== "ar") {
      throw new Error(
        `Invalid language option: "${values.lang}". Expected "en" or "ar".`,
      );
    }

    if (positionals.length > 1) {
      throw new Error(
        `Too many positional arguments: "${positionals.slice(1).join(", ")}". Expected at most one date argument.`,
      );
    }

    const dateArg = positionals[0];
    const parsedDate = dateArg ? parseDate(dateArg) : undefined;

    if (dateArg !== undefined && !parsedDate) {
      throw new Error(
        `Invalid date argument: "${dateArg}". Expected YYYY-MM-DD.`,
      );
    }

    const date = parsedDate ?? new Date();
    const locale = values.lang === "ar" ? "ar-EG" : "en-GB";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Africa/Cairo",
    };
    const formatDate = (d: Date) =>
      new Intl.DateTimeFormat(locale, options).format(d);
    const isAgaza = agaza.isAgaza(date);
    const nextAgaza = agaza.nextAgaza(date);
    const timeUntilAgaza = agaza.timeUntilAgaza(date);

    if (values.json) {
      const output = {
        isAgaza,
        date: date.toISOString(),
        nextAgaza: nextAgaza.toISOString(),
        timeUntilAgaza,
        timeZone: "Africa/Cairo",
      };
      log(JSON.stringify(output, null, 2));
    } else {
      if (values.lang === "en") {
        if (isAgaza) {
          log(
            parsedDate
              ? `Yes - ${formatDate(date)} is agaza 🎉`
              : "Yes - it's agaza 🎉",
            "green",
          );
        } else {
          log(
            parsedDate
              ? `No - ${formatDate(date)} is not agaza. Next agaza is on ${formatDate(nextAgaza)}`
              : `Not yet - ${formatDuration(timeUntilAgaza, "en")} until Friday`,
            "yellow",
          );
        }
      } else {
        if (isAgaza) {
          log(
            parsedDate
              ? `أيوه - ${formatDate(date)} أجازة 🎉`
              : `النهارده أجازة 🎉`,
            "green",
          );
        } else {
          log(
            parsedDate
              ? `لأ - ${formatDate(date)} مش أجازة. أجازة ${formatDate(nextAgaza)}`
              : `لسه لأ - ${formatDuration(timeUntilAgaza, "ar")} لحد يوم الجمعة`,
            "yellow",
          );
        }
      }
    }
  }
} catch (error) {
  logError(error instanceof Error ? error.message : String(error));
  logError("Run 'agaza --help' for usage.");
  process.exitCode = 1;
}
