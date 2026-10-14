# agaza 🇪🇬

[![npm version](https://img.shields.io/npm/v/@mostafaabbas/agaza.svg)](https://www.npmjs.com/package/@mostafaabbas/agaza)
[![license](https://img.shields.io/npm/l/@mostafaabbas/agaza.svg)](https://github.com/mostafaabbas98/agaza/blob/main/LICENSE)
[![CI](https://github.com/mostafaabbas98/agaza/actions/workflows/ci.yml/badge.svg)](https://github.com/mostafaabbas98/agaza/actions/workflows/ci.yml)

> النهارده أجازة؟ — Is it agaza today?

A tiny, zero-dependency package that tells you whether a date falls on the Egyptian weekend (**Friday or Saturday**), and how long you have to wait for the next one. Everything is calculated in **Cairo time**, so you get the same answer wherever your code runs.

Written in TypeScript, so type definitions are included out of the box (no `@types` package needed).

It also ships a command line tool, so you can ask from your terminal without installing anything.

## Install

```bash
npm install @mostafaabbas/agaza
```

## Usage

```js
import { isAgaza, timeUntilAgaza, nextAgaza } from "@mostafaabbas/agaza";

// Is today agaza?
isAgaza(); // true on Friday & Saturday, false otherwise

// Check any moment (Cairo time decides, wherever you are)
isAgaza(new Date("2026-09-18T00:00:00+03:00")); // true  (Friday in Cairo)
isAgaza(new Date("2026-09-17T23:00:00+03:00")); // false (still Thursday in Cairo)

// How long until agaza? (milliseconds)
timeUntilAgaza(new Date("2026-09-24T12:00:00+03:00")); // 43200000 (Thursday noon: 12 hours left)
timeUntilAgaza(new Date("2026-09-18T00:00:00+03:00")); // 604800000 (Friday: a whole week until the next one)

// When does the next agaza start?
nextAgaza(new Date("2026-09-15T10:00:00+03:00")); // the instant Friday 18 Sep begins in Cairo

// Show it in Cairo time, even if your server is elsewhere
nextAgaza().toLocaleString("en-EG", { timeZone: "Africa/Cairo" });
```

## API

### `isAgaza(date?)`

| Parameter | Type   | Default      | Description        |
| --------- | ------ | ------------ | ------------------ |
| `date`    | `Date` | `new Date()` | The date to check. |

**Returns:** `boolean`: `true` if the given moment falls on a Friday or Saturday **in Cairo**.

**Throws:** a `TypeError` if `date` is not a `Date` object, or a `RangeError` if it is an invalid date (for example `new Date("not a date")`). Both extend `Error`.

### `timeUntilAgaza(date?)`

| Parameter | Type   | Default      | Description                  |
| --------- | ------ | ------------ | ---------------------------- |
| `date`    | `Date` | `new Date()` | The date to count down from. |

**Returns:** `number`: milliseconds until the next agaza starts (Friday 00:00 in Cairo). Always greater than zero: during agaza it counts down to **next** week's Friday. Use `isAgaza()` to check whether the given date is already agaza.

**Throws:** a `TypeError` if `date` is not a `Date` object, or a `RangeError` if it is an invalid date.

### `nextAgaza(date?)`

| Parameter | Type   | Default      | Description                  |
| --------- | ------ | ------------ | ---------------------------- |
| `date`    | `Date` | `new Date()` | The date to look ahead from. |

**Returns:** `Date`: a new `Date` for the moment the next agaza starts (Friday 00:00 in Cairo). A `Date` is an instant, not a wall clock, so outside Egypt it prints in your own timezone: the same moment, shown differently. The date you pass in is never modified. During agaza it returns next week's Friday.

**Throws:** a `TypeError` if `date` is not a `Date` object, or a `RangeError` if it is an invalid date.

## CLI

Ask without installing anything:

```bash
npx @mostafaabbas/agaza
```

Or install it globally and use the short name:

```bash
npm install -g @mostafaabbas/agaza
agaza
```

```console
$ agaza
Not yet - 1 day, 1 hour until Friday

$ agaza 2026-10-14
No - Wednesday, 14 Oct 2026 is not agaza. Next agaza is on Friday, 16 Oct 2026

$ agaza 2026-12-25
Yes - Friday, 25 Dec 2026 is agaza 🎉

$ agaza --lang ar
لسه لأ - يوم وساعة لحد يوم الجمعة
```

### Arguments and options

| Argument / option | Short | Description                                                      |
| ----------------- | ----- | ---------------------------------------------------------------- |
| `[date]`          |       | A day to check, as `YYYY-MM-DD`. Omit it to ask about right now. |
| `--lang <en\|ar>` | `-l`  | Language of the human-readable output. Default: `en`.            |
| `--json`          | `-j`  | Machine-readable output.                                         |
| `--help`          | `-h`  | Show usage.                                                      |
| `--version`       | `-v`  | Show the installed version.                                      |

### Scripting with `--json`

```console
$ agaza 2026-12-25 --json
{
  "isAgaza": true,
  "date": "2026-12-25T00:00:00.000Z",
  "nextAgaza": "2026-12-31T22:00:00.000Z",
  "timeUntilAgaza": 597600000,
  "timeZone": "Africa/Cairo"
}
```

`date` and `nextAgaza` are ISO strings, and `timeUntilAgaza` is in milliseconds.

A date argument is read as midnight UTC on that day (02:00–03:00 in Cairo). The answer is the same, but `timeUntilAgaza` is counted from that moment.

**Exit codes:** `0` whenever the question was answered, whether or not it is agaza, and `1` for bad input (an invalid date, an unknown flag, an unsupported language). Errors go to stderr, so piping stdout always gives you clean output:

```bash
agaza --json > today.json   # only ever contains JSON
```

## Notes

- **Cairo time, always.** The day is decided by Cairo's calendar (`Africa/Cairo`), not by the machine's timezone, so a server in London or New York gives the same answer as one in Maadi.
- Agaza starts at **Friday 00:00 Cairo time**. On the night Egypt switches to summer time, that midnight does not exist (clocks jump from 23:59 to 01:00), and `nextAgaza()` returns 01:00, the first moment of that Friday.
- **Daylight saving time is handled.** For example, when clocks go back in October, the last Thursday before agaza is 25 hours long, and `timeUntilAgaza()` counts real elapsed time.
- This package checks the **weekly weekend only**. Official public holidays are not included (yet 👀).
- **ESM only.** Requires Node.js 20 or later. If you're using CommonJS, load it with a dynamic import:

  ```js
  import("@mostafaabbas/agaza").then(({ isAgaza }) => {
    console.log(isAgaza());
  });
  ```

## Roadmap

- [x] `timeUntilAgaza()`: how much time is left until the next agaza
- [x] `nextAgaza()`: the date when the next agaza starts
- [x] Cairo timezone support
- [x] CLI: `npx @mostafaabbas/agaza`
- [ ] Egyptian public holidays

## License

[MIT](https://github.com/mostafaabbas98/agaza/blob/main/LICENSE) © Mostafa Abbas
