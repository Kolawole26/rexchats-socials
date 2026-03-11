# Composables / api.js Guide

**Purpose:** Central HTTP client for all API communication in the project. Every network request in the app must go through this composable — never call `fetch` or `axios` directly inside components or pages.

---

## Structure

- Lives at `composables/api.js`.
- Bootstraps a Pinia store instance at the module level to read the auth token before the composable is called inside a component lifecycle.
- Exports a single composable function `useApiRequest()` which returns `{ sendRequest }`.
- `sendRequest` accepts a single `params` object and resolves to the raw `data` value from Nuxt's `useFetch`.

**Params shape:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `method` | `String` | `'GET'` | HTTP verb |
| `endpoint` | `String` | — | Key in `endpoints.js` or a raw path string |
| `data` | `Any` | `null` | Body for non-GET requests |
| `queryParams` | `Object` | `{}` | Appended as URL query string |
| `customOptions` | `Object` | `{}` | Merged into Nuxt `useFetch` options (e.g. extra headers) |
| `id` | `String/Number` | `null` | Appended to the resolved URL as `/{id}` |

---

## Responsibilities

- **Base URL resolution** — reads `BASE_URL` from `useRuntimeConfig().public` and prepends it to every request.
- **Endpoint lookup** — checks `endpoints` map first; falls back to treating the string as a raw path.
- **Authorization header** — attaches `Authorization: Bearer <token>` automatically using the token from `userDetailsStore`.
- **FormData handling** — when `data` is a `FormData` instance the `Content-Type` header is stripped so the browser sets the correct multipart boundary automatically.
- **JSON body** — non-FormData bodies are serialised with `JSON.stringify`.
- **Error forwarding** — checks `response.error.value`, throws it, and delegates to `useErrorHandler().handleError()` so the caller always receives a consistent error shape.

---

## Exporting

```js
// composables/api.js
export function useApiRequest() {
  const sendRequest = async (params) => { ... }
  return { sendRequest }
}
```

Usage in a page or composable:

```js
const { sendRequest } = useApiRequest()

const response = await sendRequest({
  method: 'POST',
  endpoint: 'loginUser',
  data: { email, password }
})
```

- Always destructure only `sendRequest` from the return value.
- Do **not** instantiate `useApiRequest` at the module level — call it inside `setup()` or a composable function so Nuxt's composable context is available.
- Add new endpoint keys to `composables/endpoints.js` before using them here; never hardcode paths in `sendRequest` calls.
