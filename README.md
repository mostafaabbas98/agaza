# agaza 🇪🇬

[![npm version](https://img.shields.io/npm/v/@mostafaabbas/agaza.svg)](https://www.npmjs.com/package/@mostafaabbas/agaza)
[![license](https://img.shields.io/npm/l/@mostafaabbas/agaza.svg)](https://github.com/mostafaabbas98/agaza/blob/main/LICENSE)
[![CI](https://github.com/mostafaabbas98/agaza/actions/workflows/ci.yml/badge.svg)](https://github.com/mostafaabbas98/agaza/actions/workflows/ci.yml)

> النهارده أجازة؟ — Is it agaza today?

A tiny, zero-dependency package that tells you whether a date falls on the Egyptian weekend (**Friday or Saturday**), and how long you have to wait for the next one.

Written in TypeScript, so type definitions are included out of the box (no `@types` package needed).

## Install

```bash
npm install @mostafaabbas/agaza
```

## Usage

```js
import { isAgaza, timeUntilAgaza, nextAgaza } from "@mostafaabbas/agaza";

// Is today agaza?
isAgaza(); // true on Friday & Saturday, false otherwise

// Check any date
isAgaza(new Date(2026, 8, 18)); // true  (Friday)
isAgaza(new Date(2026, 8, 15)); // false (Tuesday)

// How long until agaza? (milliseconds)
timeUntilAgaza(new Date(2026, 8, 24, 12, 0)); // 43200000 (Thursday noon: 12 hours left)
timeUntilAgaza(new Date(2026, 8, 18)); // 604800000 (Friday: a whole week until the next one)

// When does the next agaza start?
nextAgaza(new Date(2026, 8, 15)); // Fri Sep 18 2026 00:00 (Tuesday)
```

## API

### `isAgaza(date?)`

| Parameter | Type   | Default      | Description        |
| --------- | ------ | ------------ | ------------------ |
| `date`    | `Date` | `new Date()` | The date to check. |

**Returns:** `boolean`: `true` if the date is a Friday or Saturday.

**Throws:** an error if `date` is not a `Date` object or is an invalid date (for example `new Date("not a date")`).

### `timeUntilAgaza(date?)`

| Parameter | Type   | Default      | Description                  |
| --------- | ------ | ------------ | ---------------------------- |
| `date`    | `Date` | `new Date()` | The date to count down from. |

**Returns:** `number`: milliseconds until the next agaza starts (Friday 00:00). Always greater than zero: during agaza it counts down to **next** week's Friday. Use `isAgaza()` to check whether the given date is already agaza.

**Throws:** an error if `date` is not a `Date` object or is an invalid date.

### `nextAgaza(date?)`

| Parameter | Type   | Default      | Description                  |
| --------- | ------ | ------------ | ---------------------------- |
| `date`    | `Date` | `new Date()` | The date to look ahead from. |

**Returns:** `Date`: a new `Date` for the start of the next agaza (Friday 00:00, local time). The date you pass in is never modified. During agaza it returns next week's Friday.

**Throws:** an error if `date` is not a `Date` object or is an invalid date.

## Notes

- The day is calculated in the **local timezone** of the machine running the code. If your server is not in Egypt, the result may differ from Cairo time around midnight.
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
- [ ] Cairo timezone support
- [ ] CLI: `npx @mostafaabbas/agaza`

## License

[MIT](https://github.com/mostafaabbas98/agaza/blob/main/LICENSE) © Mostafa Abbas
