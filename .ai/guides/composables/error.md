# Composables / error.js Guide

**Purpose:** Global, standardised error handler for all API failures and runtime exceptions. Keeps error messaging consistent across the entire application and centralises session-expiry redirects.

---

## Structure

- Lives at `composables/error.js`.
- Exports a single composable function `useErrorHandler()`.
- Maintains two reactive refs: `error` (the human-readable message) and `statusCode` (the numeric HTTP status).
- Contains a `statusMessages` lookup that maps known HTTP status codes to friendly strings.

**Status code map (defined internally):**

| Code | Message |
|------|---------|
| 400 | Please check your input and try again. |
| 409 | Conflict error. Please try again later. |
| 422 | Unprocessable entity. Please check your input. |
| 423 | Resource is locked. Please try again later. |
| 429 | Too many requests. Please try again later. |
| 498 | Invalid token. Please log in again. |
| default | An unexpected error occurred. Please try again. |

---

## Responsibilities

- **Extract status code** — reads `err.status_code` or `err.response?.status_code` from the raw error object.
- **Set error message** — uses the raw `err.message` when a known status code is present; falls back to `statusMessages.default` when no network code is available (e.g. offline).
- **Session-expiry redirect** — navigates to `/login?toast=Session Expired` and clears `localStorage` (preserving the `color-theme` key) when status code is `401` or `440`.
- **clearError** — resets both reactive refs to `null`; call this when starting a new request or dismissing an error UI.

---

## Exporting

```js
export function useErrorHandler() {
  const error = ref(null)
  const statusCode = ref(null)

  function handleError(err) { ... }
  function clearError() { ... }

  return { error, statusCode, handleError, clearError }
}
```

Usage:

```js
const { error, handleError, clearError } = useErrorHandler()

try {
  await sendRequest({ ... })
} catch (err) {
  handleError(err)
  // error.value now contains the user-facing message
}
```

- Always call `clearError()` before initiating a new request so stale error state does not persist.
- Do **not** add redirect logic outside this composable — all session-expiry navigation must live here.
- If a new HTTP status code needs a custom message, add it to the `statusMessages` map inside this file.
