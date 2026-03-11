# error.vue Guide

**Purpose:** Global Nuxt error page displayed whenever `createError` is thrown or an unhandled runtime error occurs. Renders the error code, a contextual message, and a button that clears the error and redirects to the home page.

---

## Structure

- Lives at the project root as `error.vue`.
- Uses `<script setup>` with Nuxt's built-in `useError()` composable.
- Reads the error object injected by Nuxt's error-handling system (contains `statusCode` and `message`).
- Uses `clearError({ redirect: '/' })` to dismiss the error and navigate home.

---

## Responsibilities

- **Display error code** — renders `error.statusCode` (e.g. `404`, `500`) prominently as a large heading.
- **Contextual message** — displays `error.message` with a fallback of `"Page not found"` when no message is provided.
- **Icon rendering** — uses `<BaseCustomIcon name="error" />` to show an inline SVG indicating the error visually.
- **Recovery path** — the "Back to Home" button calls `handleError` which triggers `clearError({ redirect: '/' })`, resetting Nuxt's error state.

---

## Exporting

`error.vue` at the project root is auto-detected by Nuxt — no configuration is needed.

Usage patterns:

```js
// Triggering this page from middleware or server routes:
throw createError({ statusCode: 404, message: 'The page does not exist' })
throw createError({ statusCode: 500, message: 'Internal server error' })
```

When customising:
- To add more error-specific messages, map `error.statusCode` to a string in the template or a computed property.
- Do not add application navigation (sidebar, header) to this file — the error page intentionally has no layout chrome.
- Ensure `<BaseCustomIcon name="error" />` has a corresponding `error.svg` in `~/assets/icons/`.
