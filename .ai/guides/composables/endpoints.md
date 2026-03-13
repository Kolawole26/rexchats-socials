# Composables / endpoints.js Guide

**Purpose:** Single source of truth for every API route path used in the project. Centralising endpoints here prevents hardcoded strings scattered across components and makes backend URL changes a one-file edit.

---

## Structure

- Lives at `composables/endpoints.js`.
- Exports a plain object called `endpoints` grouped by domain (Auth, Users, etc.).
- Keys are camelCase descriptive names; values are relative path strings (no trailing slash).

```js
// composables/endpoints.js
const endpoints = {
  // Auth Endpoints
  loginUser:  '/users/auth',
  logoutUser: '/users/logout',

  // User Endpoints
  getUserProfile: '/users/profile',
}

export { endpoints }
```

---

## Responsibilities

- **Map feature keys to URL strings** — `api.js` looks up `endpoints[endpoint]` and prepends the base URL.
- **Group routes by domain** — use comment headings (`// Auth Endpoints`, `// User Endpoints`, etc.) to keep the file scannable as it grows.
- **No logic** — this file must remain a pure data object; no functions, no conditional paths.

---

## Exporting

```js
export { endpoints }
```

- Named export only — consumed by `api.js` via `import { endpoints } from './endpoints'`.
- When adding a new API call, register its key here **first**, then reference it in `sendRequest({ endpoint: 'myNewKey' })`.
- Never import endpoints directly inside components; always go through `useApiRequest()`.
