# agaza 🇪🇬

[![npm version](https://img.shields.io/npm/v/@mostafaabbas/agaza.svg)](https://www.npmjs.com/package/@mostafaabbas/agaza)
[![license](https://img.shields.io/npm/l/@mostafaabbas/agaza.svg)](./LICENSE)

> النهارده أجازة؟ — Is it agaza today?

A tiny, zero-dependency package that tells you whether a date falls on the Egyptian weekend (**Friday or Saturday**).

## Install

```bash
npm install @mostafaabbas/agaza
```

## Usage

```js
import { isAgaza } from "@mostafaabbas/agaza";

// Is today agaza?
isAgaza(); // true on Friday & Saturday, false otherwise

// Check any date
isAgaza(new Date(2026, 8, 18)); // true  (Friday)
isAgaza(new Date(2026, 8, 15)); // false (Tuesday)
```

## API

### `isAgaza(date?)`

| Parameter | Type   | Default      | Description        |
| --------- | ------ | ------------ | ------------------ |
| `date`    | `Date` | `new Date()` | The date to check. |

**Returns:** `boolean`: `true` if the date is a Friday or Saturday.

**Throws:** an error if `date` is not a `Date` object or is an invalid date (for example `new Date("not a date")`).

## Notes

- The day is calculated in the **local timezone** of the machine running the code. If your server is not in Egypt, the result may differ from Cairo time around midnight.
- This package checks the **weekly weekend only**. Official public holidays are not included (yet 👀).
- ESM only. Requires Node.js 18 or later.

## Roadmap

- [ ] `timeUntilAgaza()`: how much time is left until the next agaza
- [ ] Cairo timezone support
- [ ] CLI: `npx @mostafaabbas/agaza`

## License

[MIT](./LICENSE) © Mostafa Abbas
