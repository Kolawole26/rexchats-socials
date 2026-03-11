# Composables / reUseFunctions.ts Guide

**Purpose:** Shared utility functions used across pages, components, and composables. Check this file before writing a new helper — the function you need may already exist.

---

## Structure

- Lives at `composables/reUseFunctions.ts`.
- A flat collection of named exports — no class, no default export.
- All functions are pure and stateless (no reactive refs, no Nuxt composable calls).

**Exported functions:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `amountFunction` | `(amount) → string` | Formats a number with comma-separated thousands |
| `getCurrencySymbol` | `(currencyCode) → string` | Returns the symbol for a given ISO 4217 currency code |
| `useQueryParams` | `(params) → object` | Strips empty, `null`, or `undefined` keys from a params object before appending to a URL |
| `truncateWord` | `(word, maxLength?) → string` | Truncates a string and appends `...` if it exceeds `maxLength` (default 20) |
| `getInitials` | `(phrase) → string` | Returns uppercased initials from a space-separated string |
| `addSpacesToNumber` | `(numberString, spaceCount?) → string` | Inserts `&nbsp;` every 4 digits (useful for card number display) |

---

## Responsibilities

- **Number formatting** — `amountFunction` converts a raw number to a locale-friendly comma-separated string.
- **Currency symbols** — `getCurrencySymbol` supports USD, EUR, GBP, JPY, AUD, CAD, NGN.
- **Query param cleaning** — `useQueryParams` prevents empty strings from appearing in API requests.
- **Display helpers** — `truncateWord`, `getInitials`, and `addSpacesToNumber` are purely presentational.

---

## Exporting

All members are named exports:

```ts
export function amountFunction(amount) { ... }
export function getCurrencySymbol(currencyCode) { ... }
export const useQueryParams = (params) => { ... }
export const truncateWord = (word, maxLength = 20) => { ... }
export const getInitials = (phrase) => { ... }
export const addSpacesToNumber = (numberString, spaceCount = 4) => { ... }
```

Usage:

```ts
import { amountFunction, truncateWord } from '@/composables/reUseFunctions'

amountFunction(10000)   // '10,000'
truncateWord('Hello World Long Name', 10)  // 'Hello Worl...'
```

- Import only the functions you need — do not import the entire module.
- When adding a new utility, keep it pure (no side-effects) and add it to this file rather than creating a separate module.
- Extend `getCurrencySymbol` when a new currency is required; do not duplicate the logic in a component.
